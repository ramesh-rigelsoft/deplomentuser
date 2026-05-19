package com.rigel.user.model;

import java.io.Serializable;
import java.sql.Timestamp;

import jakarta.persistence.Cacheable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;


import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="todoTask")
public class TodoTask  implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5367469635652457205L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@NotBlank(message = "TodoTask title is mandatory")
	private String title;

	@NotBlank(message = "TodoTask Description is mandatory")
	private String task_description;
	
	private int status;// 1-active,2-InActive,3-delete
	
	private Timestamp created_at;
	
	private Timestamp updated_at;
	
	@ManyToOne(cascade=CascadeType.PERSIST,fetch=FetchType.EAGER)
	@JoinColumn(name="userId")
	private User user;

	public int getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getTask_description() {
		return task_description;
	}

	public int getStatus() {
		return status;
	}

	public Timestamp getCreated_at() {
		return created_at;
	}

	public Timestamp getUpdated_at() {
		return updated_at;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setTask_description(String task_description) {
		this.task_description = task_description;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public void setCreated_at(Timestamp created_at) {
		this.created_at = created_at;
	}

	public void setUpdated_at(Timestamp updated_at) {
		this.updated_at = updated_at;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}	
}