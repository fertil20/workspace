package com.workspace.server.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Embeddable
@Data
@NoArgsConstructor
public class PasswordResetToken {

    private static final int EXPIRATION = 60 * 24;

    private String token;

    private Instant expiryDate;

    public PasswordResetToken(String token) {
        this.token = token;
    }
}
