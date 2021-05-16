/*
package com.workspace.server.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class SendMailService {

    private final JavaMailSender mailSender;

    public SendMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    @Async
    public void sendEmail(String recipientEmail)
            throws MessagingException, UnsupportedEncodingException, InterruptedException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("workspace.app.8371@gmail.com", "Workspace App");
        helper.setTo(recipientEmail);

        String subject = "Запланирована новая встреча";

        String content = "<p>Добрый день!</p>"
                + "<p>Вы зарегистрированы на новое событие.</p>"
                + "<p>Перейдите в приложение, чтобы узнать подробности</p>" //todo написать информацию о событии
                + "<p><a href=\"http://localhost:3000/\">Перейти в приложение</a></p>";

        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
        // Artificial delay of 1s for demonstration purposes
        Thread.sleep(1000L);
    }
}
*/
