package com.workspace.server.service;

import com.workspace.server.model.PasswordResetToken;
import com.workspace.server.model.User;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class CleanerService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public CleanerService(MeetingRepository meetingRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void clearMeeting() {
        meetingRepository.deleteMeetingsByDateBefore(LocalDate.now());
        System.out.println("clearMeeting is Done");
    }

    @Scheduled(fixedRate = 18000000L) // half an hour
    @Transactional
    public void clearToken() {
        userRepository.findAll().forEach(user -> {
            Optional.ofNullable(user.getResetPasswordToken())
                    .map(PasswordResetToken::getExpiryDate)
                    .ifPresent(expiryDate -> {
                        if (Instant.now().isAfter(expiryDate)) {
                            user.setResetPasswordToken(null);
                        }
                    });
        });
    }
}
