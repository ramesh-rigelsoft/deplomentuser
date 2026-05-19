package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.Expense;
import com.rigel.user.model.Supplier;
import com.rigel.user.model.dto.ExpenseCreteria;
import com.rigel.user.model.dto.ExpenseDTO;
import com.rigel.user.model.dto.SupplierCreteria;
import com.rigel.user.model.dto.SupplierDTO;

public interface ISupplierService {
	
    public Supplier saveSupplier(SupplierDTO dto); 
	
	public Supplier updateSupplier(SupplierDTO dto);
	
	public List<Supplier> searchSupplier(SupplierCreteria creteria);

}
