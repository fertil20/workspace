package com.workspace.server.rest;

import com.workspace.server.dto.*;
import com.workspace.server.model.Meeting;
import com.workspace.server.model.User;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.MeetingRoomRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meetings")
@PreAuthorize("hasAuthority('Booking')")
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final MeetingRoomRepository meetingRoomRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public MeetingController(MeetingRepository meetingRepository, MeetingRoomRepository meetingRoomRepository,
                             UserRepository userRepository, JavaMailSender mailSender) {
        this.meetingRepository = meetingRepository;
        this.meetingRoomRepository = meetingRoomRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    @GetMapping("/room")
    public List<MeetingRoomResponse> getMeetingRooms() {
        return meetingRoomRepository.findAll().stream().map(meetingRoom -> new MeetingRoomResponse(
                meetingRoom.getId(), meetingRoom.getAddress(), meetingRoom.getAbout(), meetingRoom.getMaxPeople()))
                .collect(Collectors.toList());
    }

    @GetMapping("/room/{id}")
    public List<MeetingsByRoomResponse> getMeetingsByRoom(@PathVariable Long id) {
        return meetingRepository.findByMeetingRoom_IdOrderByTimeOfStart(id).stream()
                .map(meeting -> new MeetingsByRoomResponse(meeting.getId(), meeting.getTitle(),
                        meeting.getDate(), meeting.getColor(), meeting.getTimeOfStart(),
                        meeting.getTimeOfEnd(), meeting.getOrganizerName(), meeting.getUsers()
                        .stream().map(user -> new MeetingUsersResponse(
                                user.getId(), user.getName())).collect(Collectors.toSet())))
                .collect(Collectors.toList());
    }

    @PostMapping("/room/{id}/newMeeting") //todo проверить свободное время пользователя и переговорной
    public void setNewMeeting(@PathVariable Long id, @RequestBody MeetingRequest request) {
        if (request.getInstant().isAfter(Instant.now())) {
            Meeting meeting = new Meeting();
            meeting.setTitle(request.getTitle());
            meeting.setDate(request.getDate());
            meeting.setColor(request.getColor());
            meeting.setTimeOfStart(request.getTimeOfStart());
            meeting.setTimeOfEnd(request.getTimeOfEnd());
            meeting.setOrganizerName(request.getOrganizerName());
            meeting.setUsers(new HashSet<>(userRepository.findAllById(request.getUsersId())));
            meeting.setMeetingRoom(meetingRoomRepository.getOne(id));
            meetingRepository.save(meeting);
/*            meeting.getUsers().forEach(user -> {new User(user.getEmail());
                try {
                    sendEmail(user.getEmail());
                } catch (MessagingException | UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                });*/
        }
    }

/*    public void sendEmail(String recipientEmail)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("workspace.app.8371@gmail.com", "Workspace App");
        helper.setTo(recipientEmail);

        String subject = "Запланирована новая встреча";

        String content = "<p>Добрый день!</p>"
                + "<p>Вы зарегистрированы на новое событие.</p>"
                + "<p>Перейдите в приложение, чтобы узнать подробности</p>" //todo написать информацию о событии
                + "<p><a href=\"http://localhost:3000/\">Перейти в приложение</a></p>";

        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }*/

    @GetMapping("/availableUsers/{date}/{timeOfStart}/{timeOfEnd}")
    public List<MeetingUsersResponse> getMeetingNewUsers(@PathVariable Map<String, String> pathVars) {
        //todo бесят дебильные алерты
        return userRepository.findAllAvailableUsers(LocalDate.parse(pathVars.get("date")),
                Byte.parseByte(pathVars.get("timeOfStart")), Byte.parseByte(pathVars.get("timeOfEnd")))
                .stream().map(user -> new MeetingUsersResponse(user.getId(), user.getName()))
                .collect(Collectors.toList());
    }
}
