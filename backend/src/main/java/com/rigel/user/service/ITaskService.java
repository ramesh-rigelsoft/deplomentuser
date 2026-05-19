package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.TodoTask;
import com.rigel.user.model.User;

import jakarta.servlet.http.HttpServletRequest;

public interface ITaskService {

	public TodoTask saveTask(TodoTask todoTask);
	
	public TodoTask editeTask(int id,TodoTask todoTask);
	
	public int deleteTask(String... taskId);
	
	public TodoTask getTaskByTitle(String title);
	
	public TodoTask getTaskByTitleId(String title,int id);
	
	public TodoTask getTaskById(int id);
	
	public List<TodoTask> taskList(int id,int startIndex,int maxPageSize);
	
	public List<TodoTask> searchTaskByTitle(int id,String title,int startIndex,int maxPageSize);
	
	public Object getTaskListNew(HttpServletRequest request, int id,int startIndex,int maxPageSize);
	
}
