/*
package com.workspace.server.service;
//todo переделать!!!!!!
import com.workspace.server.dto.ProfileEditRequest;
import com.workspace.server.dto.UserProfile;
import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.User;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class ProfileEditService {

    private final UserRepository userRepository;

    public ProfileEditService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasAuthority('View')")
    public void editOwnProfile(@PathVariable(value = "username") String username, @CurrentUser UserPrincipal currentUser, @RequestBody ProfileEditRequest request) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        if (currentUser.getUsername().equals(username))
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
            user.setSecretNote(request.getSecretNote());
            user.setStatus(request.getStatus());
            userRepository.save(user);
        }
        else if (currentUser.getPrivileges().contains("Edit_Users"))
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
            user.setSecretNote(request.getSecretNote());
            user.setStatus(request.getStatus());
            userRepository.save(user);
        }
        else {
            throw new AccessDeniedException("У вас нет прав для редактирования других пользователей");
        }
    }

    @PreAuthorize("hasAuthority('Edit_Users') and hasAuthority('View')")
    public void editUserProfile(@PathVariable(value = "username") String username,
                                @RequestBody ProfileEditRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
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
        user.setSecretNote(request.getSecretNote());
        user.setStatus(request.getStatus());
        userRepository.save(user);
    }
}
*/
