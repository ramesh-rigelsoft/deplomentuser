package com.rigel.user.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.rigel.user.util.Constaints;


@Configuration
public class AppConfig implements WebMvcConfigurer {

	@Autowired
	HeadersInterceptors headersInterceptors;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/logo/**").addResourceLocations("file:" + Constaints.LOGO_PATH);
//		registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + uploadPath + "/");
	}

	@Bean
	public ModelMapper modelMapper() {
		ModelMapper mapper = new ModelMapper();
//		mapper.setVisibility(
//				((Object) mapper)
////				.getSerializationConfig()
//				.getDefaultVisibilityChecker()
////				withFieldVisibility(JsonAutoDetect.Visibility.ANY)
//                .withGetterVisibility(JsonAutoDetect.Visibility.NONE)
//                .withSetterVisibility(JsonAutoDetect.Visibility.NONE)
//                .withCreatorVisibility(JsonAutoDetect.Visibility.NONE));
		return mapper;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(headersInterceptors);
	}
	
	@Bean
	public JavaMailSender javaMailService() {
	    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

	    mailSender.setHost("smtp.gmail.com");
	    mailSender.setPort(587);
	    mailSender.setUsername("rameshjavadeveloper.sb@gmail.com");
	    mailSender.setPassword("zwhw uamy zuxj bayb");
//	    mailSender.setUsername("info@rigelautomation.com");
//	    mailSender.setPassword("Rigel@111@@");

	    Properties props = mailSender.getJavaMailProperties();
	    props.put("mail.transport.protocol", "smtp");
	    props.put("mail.smtp.auth", "true");
	    props.put("mail.smtp.starttls.enable", "true");
	    props.put("mail.debug", "false");

	    return mailSender;
	}
	
//	@Bean
//	public JavaMailSender javaMailService() {
//	    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//	    mailSender.setHost("mail.rigelautomation.com");
//	    mailSender.setPort(465);
//
//	    mailSender.setUsername("info@rigelautomation.com");
//	    mailSender.setPassword("Rigel@2026@@");
//
//	    Properties props = mailSender.getJavaMailProperties();
//	    props.put("mail.transport.protocol", "smtp");
//	    props.put("mail.smtp.auth", "true");
//	    props.put("mail.smtp.ssl.enable", "true");
//	    props.put("mail.smtp.ssl.trust", "mail.rigelautomation.com");
//
//	    return mailSender;
//	}
}
