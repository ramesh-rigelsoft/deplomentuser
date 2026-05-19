package com.rigel.user.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IExpenseDao;
import com.rigel.user.model.Expense;
import com.rigel.user.model.dto.ExpenseCreteria;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import java.time.LocalDate;


@Repository
@Transactional
public class ExpenseDaoImpl implements IExpenseDao {
	
	@Autowired
	EntityManager entityManager;

	@Override
	public Expense saveExpense(Expense expense) {
		return entityManager.merge(expense);
	}

	@Override
	public Expense updateExpense(Expense expense) {
		return entityManager.merge(expense);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Expense> searchExpense(ExpenseCreteria creteria) {
		
		    StringBuilder jpql = new StringBuilder("FROM Expense e WHERE 1=1");

		    // Scope filter
		    if (creteria.getScope() != null) {
		        jpql.append(" AND e.scope = :scope");
		    }

		    // Type filter
		    if (creteria.getType() != null) {
		        jpql.append(" AND e.type = :type");
		    }

		    // Year filter (default current year if null)
		    int year = (creteria.getYear() != 0) ? creteria.getYear() : LocalDate.now().getYear();
		    jpql.append(" AND YEAR(e.date) = :year");

		    // Month filter (optional)
		    if (creteria.getMonth() != 0) {
		        jpql.append(" AND MONTH(e.date) = :month");
		    }

		    Query query = entityManager.createQuery(jpql.toString(), Expense.class);

		    if (creteria.getScope() != null) {
		        query.setParameter("scope", creteria.getScope());
		    }
		    if (creteria.getType() != null) {
		        query.setParameter("type", creteria.getType());
		    }

		    query.setParameter("year", year);

		    if (creteria.getMonth() != 0) {
		        query.setParameter("month", creteria.getMonth());
		    }

		    return query.getResultList();
		}





}
