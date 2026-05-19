package com.rigel.user.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.ISupplierDao;
import com.rigel.user.model.Supplier;
import com.rigel.user.model.dto.SupplierCreteria;
import com.rigel.user.model.dto.SupplierDTO;
import com.rigel.user.service.ISupplierService;

@Service
public class SupplierService implements ISupplierService {

	@Autowired
	ISupplierDao supplierDao;
	
	@Override
	public Supplier saveSupplier(SupplierDTO dto) {
		return supplierDao.saveSupplier(dto);
	}

	@Override
	public Supplier updateSupplier(SupplierDTO expense) {
		return supplierDao.updateSupplier(expense);
	}

	@Override
	public List<Supplier> searchSupplier(SupplierCreteria creteria) {
		return supplierDao.searchSupplier(creteria);
	}

}
