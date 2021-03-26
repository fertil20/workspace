package com.workspace.server.model;

import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

/**
 * Created by rajeevkumarsingh on 01/08/17.
 */
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NaturalId
    @Column(length = 60)
    private com.workspace.server.model.RoleName name;

    public Role() {

    }

    public Role(com.workspace.server.model.RoleName name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public com.workspace.server.model.RoleName getName() {
        return name;
    }

    public void setName(com.workspace.server.model.RoleName name) {
        this.name = name;
    }

}
