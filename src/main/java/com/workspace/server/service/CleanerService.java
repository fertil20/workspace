package com.workspace.server.service;

import com.workspace.server.model.PasswordResetToken;
import com.workspace.server.repository.MeetingRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
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

    @Scheduled(cron = "0 0 0 * * ?") //every day at 00:00
    @Transactional
    public void clearMeeting() {
        meetingRepository.deleteMeetingsByDateBefore(LocalDate.now().plusYears(1));
        System.out.println("clearMeeting is Done");
    }

    @Scheduled(fixedRate = 1800000L) // half an hour
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
/*
    @Scheduled(fixedRate = 900000L) // a quarter an hour
    @Transactional
    public void sendReminder() {
        return meetingRepository.findAll().stream().map(meeting -> new Meeting(meeting.getDate(), meeting.getTimeOfStart())

                    .ifPresent(date -> {
                        if (Instant.now().isAfter(date.atStartOfDay(ZoneId.systemDefault())
                                .plus(Duration.ofHours(timeOfStart)).toInstant())) {
                            user.setResetPasswordToken(null);
                        }
                    });
        }));
    }todo доделать рассылку письма за день и за два часа до события*/
}