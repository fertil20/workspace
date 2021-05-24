package com.workspace.server.rest;

import com.workspace.server.dto.*;
import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.User;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import com.workspace.server.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasAuthority('View')")
public class UserController {

    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository,
                          MeetingRepository meetingRepository,
                          UserService userService) {
        this.userRepository = userRepository;
        this.meetingRepository = meetingRepository;
        this.userService = userService;
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
                                @CurrentUser UserPrincipal currentUser,
                                @RequestBody ProfileEditRequest request) {
        userService.editProfile(currentUser, username, request);
    }

    @GetMapping("/{username}/events")
    public List<UserMeetingsResponse> getAllUserEvents(@PathVariable String username) {
        return meetingRepository.findMeetingsByUsers_UsernameOrderByTimeOfStart(username).stream()
                .map(meeting -> new UserMeetingsResponse(
                        meeting.getId(),
                        meeting.getTitle(),
                        meeting.getDate(),
                        meeting.getColor(),
                        meeting.getTimeOfStart(),
                        meeting.getTimeOfEnd(),
                        meeting.getOrganizerName(),
                        meeting.getUsers().stream()
                                .map(user -> new MeetingUsersResponse(
                                        user.getId(),
                                        user.getName()))
                                .collect(Collectors.toSet()),
                        meeting.getMeetingRoom().getAddress(),
                        meeting.getMeetingRoom().getAbout(),
                        meeting.getMeetingRoom().getMaxPeople()))
                .collect(Collectors.toList());
    }

    @Transactional
    @PostMapping("/{username}/changePassword")
    public void changeUserPassword(@PathVariable String username, @RequestBody String password) {
        User user = userRepository.findUserByUsername(username);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);

        userRepository.save(user);
    }
}