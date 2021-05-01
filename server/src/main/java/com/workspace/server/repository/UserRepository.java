package com.workspace.server.repository;

import com.workspace.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    List<User> findByIdIn(List<Long> userIds);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    User findUserByEmail(String email);

    User findByResetPasswordToken_Token(String token);

    @Query("from User u1 where u1.id not in (select u.id from User u join u.roles r where r.name =:roleName)")
    List<User> findAllNotAssignedUsers(String roleName);
}