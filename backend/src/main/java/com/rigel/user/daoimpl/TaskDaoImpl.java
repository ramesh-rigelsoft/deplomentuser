package com.rigel.user.daoimpl;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rigel.user.annotation.UserCache;
import com.rigel.user.dao.ITaskDao;
import com.rigel.user.model.TodoTask;

@Repository
@Transactional
public class TaskDaoImpl implements ITaskDao {

	@Autowired
	private EntityManager entityManager;

	@Override
	public TodoTask saveTask(TodoTask todoTask) {
		try {
			return entityManager.merge(todoTask);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public TodoTask editeTask(TodoTask todoTask) {
		return entityManager.merge(todoTask);
	}

	@Override
	public int deleteTask(String taskId) {
		int query = entityManager.createQuery("delete from TodoTask where id in(" + taskId + ")").executeUpdate();
		return query;
	}

	@Override
	public TodoTask getTaskByTitle(String title) {
		try {
			TodoTask todoTask = (TodoTask) entityManager.createQuery("from TodoTask where title ='" + title + "'")
					.getSingleResult();
			return todoTask;
		} catch (NoResultException e) {
			return null;
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public TodoTask getTaskById(int id) {
		try {
			TodoTask todoTask = (TodoTask) entityManager.createQuery("from TodoTask where id =" + id).getSingleResult();
			return todoTask;
		} catch (NoResultException e) {
			return null;
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TodoTask> getTaskList(int startIndex, int maxPageSize) {
		try {
			List<TodoTask> user = (List<TodoTask>) entityManager.createQuery("from TodoTask where status = 1")
					.setFirstResult(startIndex).setMaxResults(maxPageSize).getResultList();
			return user;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TodoTask> getSearchTaskByTitle(String title, int startIndex, int maxPageSize) {
		List<TodoTask> user = (List<TodoTask>) entityManager
				.createQuery("from TodoTask where status = 1 and title like '%" + title + "%'")
				.setFirstResult(startIndex).setMaxResults(maxPageSize).getResultList();
		return user;
	}

	@Override
	public TodoTask getTaskByTitleId(String title, int id) {
		try {
			TodoTask todoTask = (TodoTask) entityManager
					.createQuery("from TodoTask where title ='" + title + "' and id!=" + id).getSingleResult();
			return todoTask;
		} catch (NoResultException e) {
			return null;
		} catch (Exception e) {
			return null;
		}
	}
}
