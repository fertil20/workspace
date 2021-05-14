package com.workspace.server.rest;

import com.workspace.server.dto.MeetingRequest;
import com.workspace.server.dto.MeetingRoomResponse;
import com.workspace.server.dto.MeetingUsersResponse;
import com.workspace.server.dto.MeetingsByRoomResponse;
import com.workspace.server.model.Meeting;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.MeetingRoomRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meetings")
@PreAuthorize("hasAuthority('Booking')")
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final MeetingRoomRepository meetingRoomRepository;
    private final UserRepository userRepository;

    public MeetingController(MeetingRepository meetingRepository, MeetingRoomRepository meetingRoomRepository,
                             UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.meetingRoomRepository = meetingRoomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<MeetingRoomResponse> getMeetingRooms() {
        return meetingRoomRepository.findAll().stream().map(meetingRoom -> new MeetingRoomResponse(
                meetingRoom.getId(), meetingRoom.getAddress(), meetingRoom.getAbout(), meetingRoom.getMaxPeople()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public List<MeetingsByRoomResponse> getMeetingsByRoom(@PathVariable Long id) {
        return meetingRepository.findByMeetingRoom_Id(id).stream()
                .map(meeting -> new MeetingsByRoomResponse(meeting.getId(), meeting.getTitle(),
                        meeting.getDate(), meeting.getColor(), meeting.getTimeOfStart(),
                        meeting.getTimeOfEnd(), meeting.getOrganizerName(), meeting.getUsers()
                        .stream().map(user -> new MeetingUsersResponse(
                                user.getId(), user.getName())).collect(Collectors.toSet())))
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/newMeeting")
    public void setNewMeeting(@PathVariable Long id, @RequestBody MeetingRequest request) {
        if (!request.getDate().isBefore(LocalDate.now())) {
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
        }
    }
}
