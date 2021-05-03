package com.workspace.server.repository;

import com.workspace.server.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    @Modifying
    @Query(nativeQuery = true, value = "DELETE from users_roles where role_name = :roleName")
    void deleteAssociations(String roleName);
}
