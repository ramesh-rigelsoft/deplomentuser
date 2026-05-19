package com.rigel.user.model.dto;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
// if setter/getter not work then run lomboak from .m2 folder and add path of sts.exe and install
//@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class TaskDto {

	private int id;
	
	private String title;
	
	private String task_description;
	
	private int status;// 1-active,2-InActive,3-delete
	
	private Timestamp created_at;
	
	private Timestamp updated_at;

}
