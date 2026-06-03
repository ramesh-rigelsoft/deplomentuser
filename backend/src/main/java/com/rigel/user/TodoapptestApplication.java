package com.rigel.user;

import javax.swing.SwingUtilities;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class TodoapptestApplication {

	public static void main(String[] args) {
//		SpringApplication.run(TodoapptestApplication.class, args);
		SpringApplicationBuilder builder = new SpringApplicationBuilder(TodoapptestApplication.class);

        builder.headless(false)      // <<< THIS IS IMPORTANT
               .run(args);
        
       
		SwingUtilities.invokeLater(() -> {
            FXApp.startBrowser();
        });
	}

}

//jpackage --type msi --name TodoApp --input . --main-jar todoapp.jar --main-class com.app.todoapp.TodoapptestApplication --app-version 1.0.0 --win-menu --win-shortcut --win-dir-chooser
