package com.rigel.user.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.dao.ISubscriptionPlanDao;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.UserSubscriptionLog;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.ISubscriptionPlanService;
import com.rigel.user.util.PagePermission;

@Service
public class SubscriptionPlanServiceImpl implements ISubscriptionPlanService {
	
	@Autowired
	IRolesManagementDao rolesManagementDao;
	
	@Autowired
	ISubscriptionPlanDao subscriptionPlanDao;

	@Override
	public SubscriptionPlan saveSubscriptionPlan() {
		
		List<SubscriptionPlan> plans = List.of(

			    // STANDER PLAN
			    SubscriptionPlan.builder()
			            .subscriptionName("BASIC")
			            .subscriptionCode("RASUB01")
			            .subscriptionType("YEARILY")
			            .amountPerMonth(899.0)
			            .branchCount(1)
			            .month(12)
			            .gst(1941.84)
			            .totalAmount(12729.84)
			            .permissions(Set.of(
			                    PagePermission.DASHBOARD_VIEW,
			                    PagePermission.INBOUND_VIEW,
			                    PagePermission.INVENTORY_VIEW,
			                    PagePermission.OUTBOUND_VIEW,
			                    PagePermission.VENDOR_ADD,
			                    PagePermission.VENDOR_LIST,
			                    PagePermission.EXPENSE_VIEW,
			                    PagePermission.ACCOUNT_SETTING,
			                    PagePermission.SUMMARY_REPORT,
			                    PagePermission.REPAIR_CREATE,
			                    PagePermission.REPAIR_LIST,
			                    PagePermission.REPAIR_VIEW,
			                    PagePermission.GARBAGE_LIST,
			                    PagePermission.TRANSACTION_VIEW
			            ).stream().collect(java.util.stream.Collectors.joining(",")))      
			            .SUKCount(5000)
			            
			            .isRepaireAllow(true)
			            .isSalesAllow(true)
			            .isEmployeeAllow(true)
			            .perDayRepaireCount(10)
			            .perDayMobileSmartDevicesSalesCount(20)
			            .perDayComputerLaptopSalesCount(15)
			            .perDayNormalTypeSalesCount(20)
			            
			            
			            .isMultipleBranch(false)
			            .perBranchUser(1)
			            .isMultipleUser(true)
			            .userCount(1)
			            .isReplaceItem(true)
			            .isReturnItem(true)
			            .isDownloadInvoice(true)
			            .isfilterInventory(true)
			            .isfilterSales(true)
			            .isDownloadExcelSales(true)
			            .isDownloadExcelEntryItem(true)
			            .createdAt(LocalDateTime.now())
			            .build(),

			    // POOER PLAN
			    SubscriptionPlan.builder()
			            .subscriptionCode("POOER01")
			            .subscriptionType("YEARLY")
			            .amountPerMonth(499.0)
			            .month(12)
			            .gst(1077.84)
			            .totalAmount(7065.84)
			            .permissions(Set.of(
			                    PagePermission.DASHBOARD_VIEW,
			                    PagePermission.INBOUND_VIEW,
			                    PagePermission.INVENTORY_VIEW,
			                    PagePermission.OUTBOUND_VIEW,
			                    PagePermission.VENDOR_ADD,
			                    PagePermission.VENDOR_LIST,
			                    PagePermission.EXPENSE_VIEW
			            ).stream().collect(java.util.stream.Collectors.joining(",")))
			            .isMultipleBranch(true)
			            .perBranchUser(1)
			            .branchCount(1)
			            .isMultipleUser(true)
			            .userCount(1)
			            
			            .isRepaireAllow(true)
			            .isSalesAllow(true)
			            .isEmployeeAllow(true)
			            .perDayRepaireCount(10)
			            .perDayMobileSmartDevicesSalesCount(20)
			            .perDayComputerLaptopSalesCount(15)
			            .perDayNormalTypeSalesCount(20)
			            
			            .isReplaceItem(false)
			            .isReturnItem(false)
			            .isDownloadInvoice(true)
			            .isfilterInventory(true)
			            .isfilterSales(true)
			            .isDownloadExcelSales(true)
			            .isDownloadExcelEntryItem(false)
			            .createdAt(LocalDateTime.now())
			            .build(),

			    // PREMIUM PLAN
			            SubscriptionPlan.builder()
			            .subscriptionName("PREMIUM")
			            .subscriptionCode("RASUB03")
			            .subscriptionType("YEARILY")
			            .amountPerMonth(899.0)
			            .month(12)
			            .gst(1941.84)
			            .totalAmount(12729.84)
			            .permissions(Set.of(
			                    PagePermission.DASHBOARD_VIEW,
			                    PagePermission.INBOUND_VIEW,
			                    PagePermission.INVENTORY_VIEW,
			                    PagePermission.OUTBOUND_VIEW,
			                    PagePermission.VENDOR_ADD,
			                    PagePermission.VENDOR_LIST,
			                    PagePermission.EXPENSE_VIEW,
			                    PagePermission.ACCOUNT_SETTING,
			                    PagePermission.SUMMARY_REPORT,
			                    PagePermission.REPAIR_CREATE,
			                    PagePermission.REPAIR_LIST,
			                    PagePermission.REPAIR_VIEW,
			                    PagePermission.GARBAGE_LIST,
			                    PagePermission.TRANSACTION_VIEW
			            ).stream().collect(java.util.stream.Collectors.joining(",")))      
			            .SUKCount(50000)
			            .isMultipleBranch(false)
			            .perBranchUser(1)
			            .isMultipleUser(true)
			            .userCount(1)
			            
			            .isRepaireAllow(true)
			            .isSalesAllow(true)
			            .isEmployeeAllow(true)
			            .perDayRepaireCount(10)
			            .perDayMobileSmartDevicesSalesCount(20)
			            .perDayComputerLaptopSalesCount(15)
			            .perDayNormalTypeSalesCount(20)
			            
			            
			            .isReplaceItem(true)
			            .isReturnItem(true)
			            .isDownloadInvoice(true)
			            .isfilterInventory(true)
			            .isfilterSales(true)
			            .isDownloadExcelSales(true)
			            .isDownloadExcelEntryItem(true)
			            .createdAt(LocalDateTime.now())
			            .build()
			);
			plans.stream().forEach(sp->{
			    rolesManagementDao.saveSubscriptionPlan(sp);
			});
		
		return null;
	}

	@Override
	public UserSubscription getSubscriptionPlanByOwnerId(Integer ownerId,String branchCode) {
		return rolesManagementDao.getSubscriptionPlanByOwnerId(ownerId,branchCode);
	}

	@Override
	public UserSubscription saveUserSubscriptionPlan(UserSubscription userSubscriptionPlan) {
		return subscriptionPlanDao.saveUserSubscription(userSubscriptionPlan);
	}

	@Override
	public void deactivateSubscription(Integer ownerId, String branchCode) {
		 subscriptionPlanDao.deactivateSubscription(ownerId, branchCode);		
	}

	@Override
	public UserSubscriptionLog saveUserSubscriptionLogPlan(UserSubscriptionLog userSubscriptionPlan) {
		return subscriptionPlanDao.saveUserSubscriptionLogPlan(userSubscriptionPlan);
	}

	@Override
	public List<SubscriptionPlan> subscriptionPlanList() {
		return subscriptionPlanDao.subscriptionPlanList();
	}

	@Override
	public List<UserSubscription> userSubscriptionPlanList(SearchCriteria searchCriteria) {
		return subscriptionPlanDao.userSubscriptionPlanList(searchCriteria);
	}

}
