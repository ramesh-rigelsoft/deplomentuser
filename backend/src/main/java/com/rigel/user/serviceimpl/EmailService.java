package com.rigel.user.serviceimpl;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

//	@Autowired
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlEmail(String toEmail,String licenceKey,String username,String password,String software) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Rigel Team");

        // 👇 HTML CONTENT HERE
        String htmlContent =
                "<html>" +
                "<body style='margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;'>" +

                "<div style='max-width:600px; margin:30px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);'>" +

                // Header
                "<div style='background:linear-gradient(135deg,#0d6efd,#6610f2); padding:20px; text-align:center; color:white;'>" +
                "<h1 style='margin:0;'>"+software+"</h1>" +
                "</div>" +

                // Body
                "<div style='padding:30px; color:#333;'>" +

                "<h2 style='color:#0d6efd;'>Welcome to Rigel Family !!</h2>" +

                "<p style='font-size:15px; line-height:1.6;'>" +
                "Our team is very happy to have you join the <b>Rigel Team</b>." +
                "</p>" +

                "<hr style='border:none; border-top:1px solid #eee; margin:20px 0;'/>" +

                "<p><b>Your Login Details:</b></p>" +

                "<p style='background:#f8f9fa; padding:10px; border-radius:5px;'>" +
                "&#128100; Licence key: <b>" + licenceKey + "</b><br/>" +
                "&#128100; Username: <b>" + username + "</b><br/>" +
                "&#128273; Password: <b>" + password + "</b>"+
                "</p>" +

                "<p style='margin-top:20px; font-size:14px; color:#555;'>" +
                "Please change your password after first login for security purpose." +
                "</p>" +

                "</div>" +

                // Footer
                "<div style='background:#f1f1f1; text-align:center; padding:15px; font-size:13px; color:#666;'>" +
                "Thanks & Regards<br/><b>Rigel Team</b>" +
                "</div>" +

                "</div>" +

                "</body>" +
                "</html>";

        helper.setText(htmlContent, true); // 👉 true = HTML enable

        mailSender.send(message);
    }
    
    public void sendOtpEmail(String toEmail, String otp,String software) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject(software+" OTP");

        String htmlContent =
                "<html>" +
                "<body style='margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;'>" +

                "<div style='max-width:600px; margin:30px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);'>" +

                // Header
                "<div style='background:linear-gradient(135deg,#0d6efd,#6610f2); padding:20px; text-align:center; color:white;'>" +
                "<h1 style='margin:0;'>Welcome to "+software+"</h1>" +
                "</div>" +

                // Body
                "<div style='padding:30px; color:#333;'>" +

                "<h2 style='color:#0d6efd;'>OTP Verification</h2>" +

                "<p style='font-size:15px; line-height:1.6;'>" +
                "Use the following One Time Password (OTP) to complete your verification:" +
                "</p>" +

                // OTP BOX
                "<div style='text-align:center; margin:25px 0;'>" +
                "<span style='display:inline-block; font-size:28px; letter-spacing:5px; font-weight:bold; " +
                "background:#f8f9fa; padding:15px 25px; border-radius:8px; color:#0d6efd;'>" +
                otp +
                "</span>" +
                "</div>" +

                "<p style='font-size:14px; color:#555;'>" +
                "⏳ This OTP is valid for <b>15 minutes</b>.<br/>" +
                "🔒 Do not share this OTP with anyone." +
                "</p>" +

                "</div>" +

                // Footer
                "<div style='background:#f1f1f1; text-align:center; padding:15px; font-size:13px; color:#666;'>" +
                "Thanks & Regards<br/><b>Rigel Team</b>" +
                "</div>" +

                "</div>" +
                "</body>" +
                "</html>";

        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}