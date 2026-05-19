package com.rigel.user.config;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;

public class UIBean<E> implements Cloneable, Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 4277953257890888339L;
	
	
	private Object responseBody;
	
	private boolean sussess;

	public void setResponseBody(Object responseBody) {
		this.responseBody = responseBody;
	}

	public void setSussess(boolean sussess) {
		this.sussess = sussess;
	}
}
