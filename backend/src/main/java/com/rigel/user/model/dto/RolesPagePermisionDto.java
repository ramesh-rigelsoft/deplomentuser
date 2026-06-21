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
public class RolesPagePermisionDto {

	private Long id;

    
 // ===== BASIC PAGE ACCESS =====
 	@Column(name = "canAll")
 	private boolean canAll;

 	@Column(name = "can_view")
 	private boolean canView;

 	@Column(name = "can_create")
 	private boolean canCreate;

 	@Column(name = "can_edit")
 	private boolean canEdit;

 	@Column(name = "can_delete")
 	private boolean canDelete;
 	
 	private int ownerId;
 	
 	private PagesDto pageId;
    private RolesDto roleId;
}
