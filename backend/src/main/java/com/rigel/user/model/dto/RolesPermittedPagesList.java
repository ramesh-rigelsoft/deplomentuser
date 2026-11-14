package com.rigel.user.model.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RolesPermittedPagesList {

 	private Long ownerId;
 	private String branchCode;
    private String roleId;
	private String pagePermittedId;
    private String pageLabel;
    
}
