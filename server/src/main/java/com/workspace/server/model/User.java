package com.workspace.server.model;

import com.workspace.server.model.audit.DateAudit;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "username"
        }),
        @UniqueConstraint(columnNames = {
                "email"
        })
})
public class User extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String name;

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 254)
    @Email
    private String email;

    @NotBlank
    @Size(max = 100)
    private String password;

    @NotBlank
    @Size(max = 50)
    private String phone="No info";;

    @NotBlank
    @Size(max = 30)
    private String tg="No info";

    @Size(max = 300)
    private String about;

    @NotBlank
    @Size(max = 50)
    private String position="No info";

    @NotBlank
    @Size(max = 300)
    private String department="No info";

    @NotBlank
    @Size(max = 3)
    private String office="000";

//    @NotBlank
    private Date birthday;

    @NotBlank
    @Size(max = 300)
    private String secretNote="No notes";

    @NotBlank
    @Size(max = 1)
    private char status='0';

    @Column(name = "reset_password_token")
    @Size (max = 30)
    private String resetPasswordToken;
    private static final int EXPIRATION = 60 * 24;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_hours",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hours_id"))
    private Set<WorkTime> workTimes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_days",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "days_id"))
    private Set<WorkDay> workDays = new HashSet<>();

    @Override
    public int hashCode() {

        return Objects.hash(username, email, phone, tg, about, position,
                department, office, secretNote, status);
    }


    public User(String name, String username, String email, String password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}