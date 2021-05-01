package com.workspace.server.rest;


import com.workspace.server.dto.ForgotPasswordRequest;
import com.workspace.server.dto.ResetPasswordTokenResponse;
import com.workspace.server.model.User;
import com.workspace.server.service.ResetPasswordService;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;


@RestController
@RequestMapping("/api/auth")
public class ResetPasswordController {

    private final JavaMailSender mailSender;
    private final ResetPasswordService userService;

    public ResetPasswordController(JavaMailSender mailSender,
                                   ResetPasswordService userService) {
        this.mailSender = mailSender;
        this.userService = userService;
    }

    @PostMapping("/forgotPassword")
    public void processForgotPassword(@Valid @RequestBody ForgotPasswordRequest request) throws MessagingException, UnsupportedEncodingException {
        String email = request.getEmail();
        String token = RandomString.make(30);

        userService.updateResetPasswordToken(token, email);
        String resetPasswordLink = "http://localhost:3000/resetPassword?token=" + token;
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
    public ResetPasswordTokenResponse showResetPasswordForm(@Valid @RequestParam(value = "token") String token) throws UsernameNotFoundException {
        User user = userService.getByResetPasswordToken(token);
        if (user!=null) {
            return new ResetPasswordTokenResponse(user.getResetPasswordToken().getToken());
        }
        else {
            throw new UsernameNotFoundException("Could not find any user with the token " + token);
        }
    }

    @PostMapping("/resetPassword")
    public void processResetPassword(@Valid @RequestParam(value = "token") String token, @RequestBody String password) {


        User user = userService.getByResetPasswordToken(token);

        userService.updatePassword(user, password);

    }
}
