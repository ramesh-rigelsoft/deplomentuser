package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.Expense;
import com.rigel.user.model.dto.ExpenseCreteria;

public interface IExpenseDao {

	public Expense saveExpense(Expense expense);

	public Expense updateExpense(Expense expense);

	public List<Expense> searchExpense(ExpenseCreteria creteria);

}
