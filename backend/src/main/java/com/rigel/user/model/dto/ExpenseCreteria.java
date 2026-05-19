package com.rigel.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseCreteria {
	
	private int year;
	private int month;
	private String user;
	private int ownerid;
	private String scope;
	private String type;

}
