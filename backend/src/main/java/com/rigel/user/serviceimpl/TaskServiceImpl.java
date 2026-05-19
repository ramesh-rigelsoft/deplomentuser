package com.rigel.user.serviceimpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.ITaskDao;
import com.rigel.user.exception.TaskTitleNotFound;
import com.rigel.user.model.TodoTask;
import com.rigel.user.model.User;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.service.ITaskService;

import jakarta.servlet.http.HttpServletRequest;

@Service
@CacheConfig(cacheNames = "userCache", keyGenerator = "TransferKeyGenerator")
public class TaskServiceImpl implements ITaskService {

	@Autowired
	ITaskDao taskDao;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private Environment environment;

	@Override
	@CacheEvict // ("userCache")
	public TodoTask saveTask(TodoTask todoTask) {
		return taskDao.saveTask(todoTask);
	}

	@Override
	@CacheEvict // it clears the cache id wise
//	@Caching( put = {
//	        @CachePut(key = "#id"),
//	        @CachePut(key = "#todoTask.getId()")
//	})
	public TodoTask editeTask(int id, TodoTask todoTask) {
		return taskDao.editeTask(todoTask);
	}

	@Override
	@CacheEvict
	public int deleteTask(String... taskId) {
		StringBuilder ids = new StringBuilder();
		for (int i = 0; i < taskId.length; i++) {
			if (i == 0) {
				ids.append(taskId[i]);
			} else {
				ids.append("," + taskId[i]);
			}

		}
		System.out.println(ids);
		return taskDao.deleteTask(ids.toString());
	}

	@Override
	public TodoTask getTaskByTitle(String title) {
		return taskDao.getTaskByTitle(title);
	}

	@Override
	public TodoTask getTaskById(int id) {
		return taskDao.getTaskById(id);
	}

	@Override
//	@Cacheable // (value="userCache", key="#user.id")
	public List<TodoTask> taskList(int id, int startIndex, int maxPageSize) {
		startIndex = getPaginationIndex(startIndex, maxPageSize);
//System.out.println(taskDao.getTaskList(startIndex, maxPageSize).get(0).getTask_description());
		return taskDao.getTaskList(startIndex, maxPageSize);
	}

	@Override
//	@Cacheable // ("userCache")
	public List<TodoTask> searchTaskByTitle(int id, String title, int startIndex, int maxPageSize) {
		startIndex = getPaginationIndex(startIndex, maxPageSize);
		return taskDao.getSearchTaskByTitle(title, startIndex, maxPageSize);
	}

	public int getPaginationIndex(int startIndex, int maxPageSize) {
		startIndex = startIndex == 0 ? startIndex : (startIndex * maxPageSize);
		return startIndex;
	}

	@Override
	public TodoTask getTaskByTitleId(String title, int id) {
		return taskDao.getTaskByTitleId(title, id);
	}

	@Override
	@Cacheable(value = "userCache", key = "#userId")
	public Object getTaskListNew(HttpServletRequest request,int userId, int startIndex, int maxPageSize) {
//		String userId1 = jwtTokenUtil
//				.getIdFromToken(request.getHeader(environment.getProperty("security.jwt.header")).substring(7));
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		if (startIndex > -1 && maxPageSize > 1) {
			// exception alreday handled globaly if wrong id
			
			startIndex = getPaginationIndex(startIndex, maxPageSize);
			//System.out.println(taskDao.getTaskList(startIndex, maxPageSize).get(0).getTask_description());
			List<TodoTask> taskList = taskDao.getTaskList(startIndex, maxPageSize);
//			List<TodoTask> taskList = this.taskList(userId, startIndex, maxPageSize);
//				    List<TaskDto>  taskDto =  modelMapper.map(taskList, List.class);

			if (taskList.size() > 0) {
				data.put("taskListSize", taskList.size());
				data.put("taskList", taskList);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Tasks has been get successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleNotFound("TodoTask Not Found");
			}
		} else {
			throw new TaskTitleNotFound("Page index and page record size are wrong entered");
		}
	}
}
