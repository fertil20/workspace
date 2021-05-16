package com.workspace.server.service;

import com.workspace.server.dto.ProfileEditRequest;
import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.User;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void editProfile(@CurrentUser UserPrincipal currentUser,
                            String username,
                            ProfileEditRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        String currentUsername = currentUser.getUsername();
        Set<String> currentUserPrivileges = currentUser.getPrivileges();

        if (!currentUsername.equals(username) && !currentUserPrivileges.contains("Edit_Users")) {
            throw new AccessDeniedException("У вас нет прав для редактирования других пользователей");
        }
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setTg(request.getTg());
        user.setAbout(request.getAbout());
        user.setStartAt(request.getStartAt());
        user.setEndAt(request.getEndAt());
        user.setStatus(request.getStatus());
        if (currentUserPrivileges.contains("Edit_Users")) {
            user.setName(request.getName());
            user.setPosition(request.getPosition());
            user.setDepartment(request.getDepartment());
            user.setOffice(request.getOffice());
            user.setBirthday(request.getBirthday());
        }
        if (currentUserPrivileges.contains("View_Secret")) {
            user.setSecretNote(request.getSecretNote());
        }
        userRepository.save(user);
    }
}
