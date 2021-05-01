package com.workspace.server.service;

import com.workspace.server.model.PasswordResetToken;
import com.workspace.server.model.User;
import com.workspace.server.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ResetPasswordService {

    private final UserRepository userRepo;

    public ResetPasswordService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public void updateResetPasswordToken(String token, String email) throws UsernameNotFoundException {
        User user = userRepo.findUserByEmail(email);
        if (user != null) {
            user.setResetPasswordToken(new PasswordResetToken(token));
            userRepo.save(user);
        } else {
            throw new UsernameNotFoundException("Could not find any user with the email " + email);
        }
    }

    public User getByResetPasswordToken(String token) {
        return userRepo.findByResetPasswordToken_Token(token);
    }

    //todo сделать обнуление токена через час

    public void updatePassword(User user, String newPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);

        user.setResetPasswordToken(null);
        userRepo.save(user);
    }
}
