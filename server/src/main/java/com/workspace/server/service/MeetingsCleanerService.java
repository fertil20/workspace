package com.workspace.server.service;

import com.workspace.server.repository.MeetingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;

@Service
public class MeetingsCleanerService {

    private final MeetingRepository meetingRepository;

    public MeetingsCleanerService(MeetingRepository meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void clearMeeting() {
        meetingRepository.deleteMeetingsByDateBefore(LocalDate.now());
        System.out.println("clearMeeting is Done");
    }
}
