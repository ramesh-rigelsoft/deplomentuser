package com.rigel.user.serviceimpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IExpenseDao;
import com.rigel.user.model.Expense;
import com.rigel.user.model.dto.ExpenseCreteria;
import com.rigel.user.model.dto.ExpenseDTO;
import com.rigel.user.service.IExpenseService;
import com.rigel.user.util.RAUtility;


@Service
public class ExpenseService implements IExpenseService{
	
	@Autowired
	private IExpenseDao expenseDao;

	@Override
	public Expense saveExpense(ExpenseDTO dto) {
		return expenseDao.saveExpense(convertToEntity(dto));
	}

	@Override
	public Expense updateExpense(Expense expense) {
		return expenseDao.updateExpense(expense);
	}

	@Override
	public List<Expense> searchExpense(ExpenseCreteria creteria) {
		return expenseDao.searchExpense(creteria);
	}
	
	public Expense convertToEntity(ExpenseDTO dto) {
	    return Expense.builder()
	            // Skip ID → DB will generate
	            .type(dto.getType())
	            .scope(dto.getScope())
	            .description(dto.getDescription())
	            .amount(dto.getAmount())
	            .proof(dto.getProof())
	            .date(RAUtility.epochToLocalDateTime(Long.valueOf(dto.getDate())))
	            .ownerId(dto.getOwnerId())
	            .createdAt(LocalDateTime.now())
	            // Skip createdAt → default set in entity
	            .build();
	}


}
