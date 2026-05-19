package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.Expense;
import com.rigel.user.model.dto.ExpenseCreteria;
import com.rigel.user.model.dto.ExpenseDTO;

public interface IExpenseService {
	
	public Expense saveExpense(ExpenseDTO dto); 
	
	public Expense updateExpense(Expense expense);
	
	public List<Expense> searchExpense(ExpenseCreteria creteria);

}
