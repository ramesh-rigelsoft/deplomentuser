package com.rigel.user.model.dto;

import com.rigel.user.model.User;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResponseInfo {
	
	private String token;
	private String refreshToken;
	private String deviceId;
	
}
