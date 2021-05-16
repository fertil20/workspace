package com.workspace.server.repository;

import com.workspace.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    User findUserByEmail(String email);

    User findByResetPasswordToken_Token(String token);

    @Modifying
    @Query(nativeQuery = true, value = "DELETE from meetings_users where user_id = :id")
    void deleteMeetingsAssociations(Long id);

    @Query("from User u1 where u1.id not in (select u.id from User u join u.roles r where r.name =:roleName)")
    List<User> findAllNotAssignedUsers(String roleName);

    @Query("from User u1 where u1.id not in (select u.id from User u join u.meetings m where" +
            " ((m.date =:date)" +
            " and " +
            "(((m.timeOfStart <:time_of_start" +
            " and m.timeOfEnd >:time_of_start)" +
            " or (m.timeOfStart <:time_of_end and m.timeOfEnd >:time_of_end)" +
            " or (m.timeOfStart =:time_of_start or m.timeOfEnd =:time_of_end)" +
            " or (m.timeOfStart >=:time_of_start and m.timeOfEnd <=:time_of_end)))))")
    List<User> findAllAvailableUsers(LocalDate date, Byte time_of_start, Byte time_of_end);
}