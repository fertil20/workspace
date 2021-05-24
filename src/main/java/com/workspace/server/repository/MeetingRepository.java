package com.workspace.server.repository;

import com.workspace.server.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    Set<Meeting> findByMeetingRoom_IdOrderByTimeOfStart(Long id);

    Set<Meeting> findMeetingsByUsers_UsernameOrderByTimeOfStart(String username);

    void deleteMeetingsByTimeOfStartBefore(LocalDate date);
}