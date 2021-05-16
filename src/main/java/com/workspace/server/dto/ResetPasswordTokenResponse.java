package com.workspace.server.dto;

import lombok.Data;

import javax.validation.constraints.Size;

@Data
public class ResetPasswordTokenResponse {
    private String token;

    public ResetPasswordTokenResponse(@Size(max = 30) String resetPasswordToken) {
    }
}
