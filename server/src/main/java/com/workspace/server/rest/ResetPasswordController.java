package com.workspace.server.rest;


import com.workspace.server.dto.ForgotPasswordRequest;
import com.workspace.server.dto.ResetPasswordRequest;
import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.User;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.service.ResetPasswordService;
import com.workspace.server.util.Utility;
import lombok.Data;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;

//@Data
@RestController
@RequestMapping("/api/auth")
public class ResetPasswordController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ResetPasswordService userService;

    private final UserRepository userRepository;

    public ResetPasswordController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

/*    @GetMapping("/forgot_password")
    public String showForgotPasswordForm(Model model) {
        return "forgot_password_form";
    }*/

    @PostMapping("/forgotPassword")
    public void processForgotPassword(@Valid @RequestBody ForgotPasswordRequest request) throws MessagingException, UnsupportedEncodingException {
        String email = request.getEmail();
        String token = RandomString.make(30);

        userService.updateResetPasswordToken(token, email);
        String resetPasswordLink = "http://localhost:8080/api/auth/reset_password?token=" + token;
        sendEmail(email, resetPasswordLink);
    }

    public void sendEmail(String recipientEmail, String link)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("workspace.app.8371@gmail.com", "Workspace Support");
        helper.setTo(recipientEmail);

        String subject = "Here's the link to reset your password";

        String content = "<p>Hello,</p>"
                + "<p>You have requested to reset your password.</p>"
                + "<p>Click the link below to change your password:</p>"
                + "<p><a href=\"" + link + "\">Change my password</a></p>"
                + "<br>"
                + "<p>Ignore this email if you do remember your password, "
                + "or you have not made the request.</p>";

        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }

    @GetMapping("/resetPassword")
    public String showResetPasswordForm(@Param(value = "token") String token, Model model) {
        User user = userService.getByResetPasswordToken(token);
        model.addAttribute("token", token);

        if (user == null) {
            model.addAttribute("message", "Invalid Token");
            return "message";
        }

        return "reset_password_form";
    }

    @PostMapping("/resetPassword")
    public void processResetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String password = request.getPassword();

        User user = userService.getByResetPasswordToken(token);

/*        if (user == null) {
            return "message";
        } else {
            userService.updatePassword(user, password);*/


    }
}
