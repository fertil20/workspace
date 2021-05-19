package com.workspace.server.rest;

import com.workspace.server.dto.MeetingRequest;
import com.workspace.server.dto.MeetingRoomResponse;
import com.workspace.server.dto.MeetingUsersResponse;
import com.workspace.server.dto.MeetingsByRoomResponse;
import com.workspace.server.model.Meeting;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.MeetingRoomRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.format.datetime.standard.InstantFormatter;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.NotAcceptableStatusException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.time.*;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meetings")
@PreAuthorize("hasAuthority('Booking')")
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final MeetingRoomRepository meetingRoomRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final ExecutorService executorService;

    public MeetingController(MeetingRepository meetingRepository,
                             MeetingRoomRepository meetingRoomRepository,
                             UserRepository userRepository,
                             JavaMailSender mailSender,
                             ExecutorService executorService) {
        this.meetingRepository = meetingRepository;
        this.meetingRoomRepository = meetingRoomRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.executorService = executorService;
    }

    @GetMapping("/room")
    public List<MeetingRoomResponse> getMeetingRooms() {
        return meetingRoomRepository.findAll().stream()
                .map(meetingRoom -> new MeetingRoomResponse(
                        meetingRoom.getId(),
                        meetingRoom.getAddress(),
                        meetingRoom.getAbout(),
                        meetingRoom.getMaxPeople()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/room/{id}")
    public List<MeetingsByRoomResponse> getMeetingsByRoom(@PathVariable Long id) {
        return meetingRepository.findByMeetingRoom_IdOrderByTimeOfStart(id).stream()
                .map(meeting -> new MeetingsByRoomResponse(
                        meeting.getId(),
                        meeting.getTitle(),
                        meeting.getColor(),
                        meeting.getTimeOfStart(),
                        meeting.getTimeOfEnd(),
                        meeting.getOrganizerName(),
                        meeting.getUsers().stream()
                                .map(user -> new MeetingUsersResponse(
                                        user.getId(),
                                        user.getName()
                                ))
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/room/{id}/newMeeting") //todo проверить свободное время пользователя и переговорной
    public void setNewMeeting(@PathVariable Long id, @RequestBody MeetingRequest request) {
        if (request.getTimeOfStart().isAfter(LocalDateTime.now())) {
            Meeting meeting = new Meeting();
            meeting.setTitle(request.getTitle());
            meeting.setColor(request.getColor());
            meeting.setTimeOfStart(request.getTimeOfStart());
            meeting.setTimeOfEnd(request.getTimeOfEnd());
            meeting.setOrganizerName(request.getOrganizerName());
            meeting.setUsers(new HashSet<>(userRepository.findAllById(request.getUsersId())));
            meeting.setMeetingRoom(meetingRoomRepository.getOne(id));
            meetingRepository.save(meeting);
            scheduleUsersNotification(meeting);
        } else {
            throw new NotAcceptableStatusException("Выбранное время уже прошло");
        }
    }

    private void scheduleUsersNotification(Meeting meeting) {
        executorService.submit(() -> meeting.getUsers().forEach(user -> {
            try {
                trySendEmail(user.getEmail());
            } catch (MessagingException | UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }));
    }

    public void trySendEmail(String recipientEmail) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("workspace.app.8371@gmail.com", "Workspace App");
        helper.setTo(recipientEmail);

        String subject = "Запланирована новая встреча";

        String content = "<p>Добрый день!</p>"
                + "<p>Вы зарегистрированы на новое событие.</p>"
                + "<p>Перейдите в приложение, чтобы узнать подробности</p>" //todo написать информацию о событии
                + "<p><a href=\"https://my-workspace.ml/\">Перейти в приложение</a></p>";

        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }

    @GetMapping("/availableUsers/{timeOfStart}/{timeOfEnd}")
    public List<MeetingUsersResponse> getMeetingNewUsers(@PathVariable String timeOfStart,
                                                         @PathVariable String timeOfEnd) {
        return userRepository.findAllAvailableUsers(Instant.parse(timeOfStart), Instant.parse(timeOfEnd))
                .stream().map(user -> new MeetingUsersResponse(user.getId(), user.getName()))
                .collect(Collectors.toList());
    }
}