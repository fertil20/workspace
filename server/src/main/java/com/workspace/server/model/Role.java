package com.workspace.server.model;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@Table(name = "roles")
public class Role {
    @Id
    @Column(length = 60, unique = true)
    private String name;

    @ManyToMany(mappedBy = "roles")
    @EqualsAndHashCode.Exclude
    private Set<User> users;

    @Convert(converter = PrivilegesConverter.class)
    @EqualsAndHashCode.Exclude
    private Set<String> privileges;

    public Role(String name) {
        this.name = name;
    }

    public Role(Set<User> users) {
        this.users = users;
    }
}
