package com.rigel.user.serviceimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.dao.IBuyerDao;
import com.rigel.user.dao.IInventoryDao;
import com.rigel.user.dao.ISalesDao;
import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.Inventory;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.dto.SalesRequest;
import com.rigel.user.model.dto.SalesResponse;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.IBuyerInfoService;

@Service
//@CacheConfig(cacheNames = "userCache", keyGenerator = "TransferKeyGenerator")
public class BuyerInfoServiceImpl implements IBuyerInfoService {
	
	@Autowired
	IBuyerDao buyerDao;
	
	@Autowired
	ISalesDao salesDao;

	@Autowired
	IInventoryDao inventoryDao;
	
	@Autowired
	ObjectMapper objectMapper;
	
	@Autowired
	FyIdGeneratorService generatorService;

	@Override
	public SalesResponse saveBuyerInfo(SalesRequest salesRequest) {
        BuyerInfo buyer = objectMapper.convertValue(salesRequest.getBuyerInfoDto(),BuyerInfo.class);
//	    buyer.setCreatedAt(RAUtility.getCurrentDateTime());
	    buyer.setStatus(1);
	    buyer.setInvoiceNumber(generatorService.generateFyId(1, "INV"));
	    buyer.setCountryCode("91");
	    
	    List<SalesInfo> salesSet = salesRequest
	            .getBuyerInfoDto().getSalesInfo()
	            .stream()
	            .map(dto -> {
	                SalesInfo sale = objectMapper.convertValue(dto, SalesInfo.class);
	                sale.setBuyerInfo(buyer);
	                sale.setCreatedAt(LocalDateTime.now());
	                sale.setStatus(1);
	                sale.setOwnerId(1);
	                sale.setBuyerInfo(buyer);
	                return sale;
	            })
	            .toList();
	    List<SalesInfo> list=new ArrayList<>();
	    salesSet.forEach(s->{
	    	list.add(s);
	    });
	    
	    
	    salesSet.stream().forEach(sal->{
	    	Inventory icount=inventoryDao.findInventoryByCode(sal.getItemCode());
	    	if(!sal.getCategory().equals("Repair Installation")){
		    	if(sal.getQuantity()<icount.getQuantity()) {
		    		int count=icount.getQuantity()-sal.getQuantity();
		    		inventoryDao.updateInventory(sal.getItemCode(), count);
		    	}else if(sal.getQuantity()==icount.getQuantity()){
		    	  	inventoryDao.deleteInventory(sal.getItemCode());
		  		}
	    	}
	    });
	    salesDao.saveSalesInfo(list); // 🔥 ONLY THIS
	    return null;
	}
	
	@Override
	public SalesResponse updateBuyerInfo(SalesRequest salesRequest) {
	
		
	    return null;
	}

//	@Override
//	public int deleteBuyerInfo(List<Long> buyerId) {
//		return buyerDao.deleteBuyerInfo(buyerId);
//	}

	@Override
	public SalesResponse searchBuyerInfo(SearchCriteria criteria) {
		return null;//buyerDao.searchBuyerInfo(criteria);
	}
	
}