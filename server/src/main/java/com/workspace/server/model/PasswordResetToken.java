package com.workspace.server.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Duration;
import java.time.Instant;

@Embeddable
@Data
@NoArgsConstructor
public class PasswordResetToken {

    private String token;

    private Instant expiryDate;

    public PasswordResetToken(String token) {
        this.token = token;
        this.expiryDate = Instant.now().plus(Duration.ofHours(1));
    }
}
