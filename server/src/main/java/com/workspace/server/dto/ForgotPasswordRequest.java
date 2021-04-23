package com.workspace.server.dto;

import lombok.Data;

import java.sql.Time;

@Data
public class ForgotPasswordRequest {
    private String email;
}
