package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.Supplier;
import com.rigel.user.model.dto.SupplierCreteria;
import com.rigel.user.model.dto.SupplierDTO;

public interface ISupplierDao {
	
    public Supplier saveSupplier(SupplierDTO dto); 
	
	public Supplier updateSupplier(SupplierDTO expense);
	
	public List<Supplier> searchSupplier(SupplierCreteria creteria);
	
}
