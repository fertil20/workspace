package com.workspace.server.rest;

import com.workspace.server.dto.*;
import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.Meeting;
import com.workspace.server.model.MeetingRoom;
import com.workspace.server.model.User;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.MeetingRoomRepository;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasAuthority('View')")
public class UserController {

    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;
    private final MeetingRoomRepository meetingRoomRepository;

    public UserController(UserRepository userRepository, MeetingRepository meetingRepository, MeetingRoomRepository meetingRoomRepository) {
        this.userRepository = userRepository;
        this.meetingRepository = meetingRepository;
        this.meetingRoomRepository = meetingRoomRepository;
    }

    @GetMapping
    public List<UserForListResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserForListResponse(user.getId(), user.getUsername(), user.getName(), user.getEmail(),
                        user.getPhone(), user.getTg(), user.getPosition(), user.getDepartment(), user.getStatus()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username, @CurrentUser UserPrincipal currentUser) throws ParseException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        if (!currentUser.getPrivileges().contains("View_Secret")) {
            return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                    user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getStatus(), user.getStartAt(), user.getEndAt());
        } else {
            return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                    user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getStartAt(), user.getEndAt());
        }
    }

    @PostMapping("/{username}/edit")
    public void editUserProfile(@PathVariable(value = "username") String username,
                                @CurrentUser UserPrincipal currentUser, @RequestBody ProfileEditRequest request) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        if (currentUser.getUsername().equals(username) && !currentUser.getPrivileges().contains("Edit_Users"))
        {
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setTg(request.getTg());
            user.setAbout(request.getAbout());
            user.setStartAt(request.getStartAt());
            user.setEndAt(request.getEndAt());
            user.setStatus(request.getStatus());
            userRepository.save(user);
        }
        else if (currentUser.getPrivileges().contains("Edit_Users") && !currentUser.getPrivileges().contains("View_Secret")) {
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setTg(request.getTg());
            user.setName(request.getName());
            user.setAbout(request.getAbout());
            user.setPosition(request.getPosition());
            user.setDepartment(request.getDepartment());
            user.setOffice(request.getOffice());
            user.setStartAt(request.getStartAt());
            user.setEndAt(request.getEndAt());
            user.setBirthday(request.getBirthday());
            user.setStatus(request.getStatus());
            userRepository.save(user);
        }
        else if (currentUser.getPrivileges().contains("Edit_Users") && currentUser.getPrivileges().contains("View_Secret"))
        {
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setTg(request.getTg());
            user.setName(request.getName());
            user.setAbout(request.getAbout());
            user.setPosition(request.getPosition());
            user.setDepartment(request.getDepartment());
            user.setOffice(request.getOffice());
            user.setStartAt(request.getStartAt());
            user.setEndAt(request.getEndAt());
            user.setBirthday(request.getBirthday());
            user.setSecretNote(request.getSecretNote());
            user.setStatus(request.getStatus());
            userRepository.save(user);
        }
        else {
            throw new AccessDeniedException("У вас нет прав для редактирования других пользователей");
        }
    }//todo перенести в отдельный сервис!

/*    @GetMapping("/{username}/events")
    public Set<Meeting> getAllUserEvents(@PathVariable String username) {
        return meetingRepository.findAllByUsers_Username(username);
    }*/ //todo удалить приколдес, который ломает сервер))

    @GetMapping("/{username}/events")
    public List<UserMeetingsResponse> getAllUserEvents(@PathVariable String username) {
        return meetingRepository.findAllByUsers_Username(username).stream().map(meeting ->
                new UserMeetingsResponse(meeting.getId(), meeting.getTitle(), meeting.getDate(), meeting.getColor(),
                        meeting.getTimeOfStart(), meeting.getTimeOfEnd(), meeting.getOrganizerName(), meeting.getUsers()
                        .stream().map(user -> new MeetingUsersResponse(
                                user.getId(), user.getName())).collect(Collectors.toSet()),
                        meeting.getMeetingRoom().getAddress(), meeting.getMeetingRoom().getAbout(),
                        meeting.getMeetingRoom().getMaxPeople()))
                .collect(Collectors.toList());
    }
}