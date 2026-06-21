package com.rigel.user.model.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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
public class PagesDto {
	private Long id;
	@Column(name = "page_url", nullable = false)
	private String roleUrl;

	@Column(name = "page_name", nullable = false)
	private String pageName;
	private boolean status;
	private String description;

}
