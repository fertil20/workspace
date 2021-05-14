package com.workspace.server.repository;

import com.workspace.server.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    Set<Meeting> findByMeetingRoom_Id(Long id);

    Set<Meeting> findAllByUsers_Username(String username);
}