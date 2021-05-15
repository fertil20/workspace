package com.workspace.server.service;

import com.workspace.server.model.User;
import com.workspace.server.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ResetPasswordService {

    private final UserRepository userRepository;

    public ResetPasswordService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void updateResetPasswordToken(String token, String email) throws UsernameNotFoundException {
        User user = userRepository.findUserByEmail(email);
        if (user != null) {
            user.setToken(token);
            userRepository.save(user);
        } else {
            throw new UsernameNotFoundException("Could not find any user with the email " + email);
        }
    }

    public User getByResetPasswordToken(String token) {
        return userRepository.findByToken(token);
    }


    public void updatePassword(User user, String newPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);

        user.setToken(null);
        userRepository.save(user);
    }
}
