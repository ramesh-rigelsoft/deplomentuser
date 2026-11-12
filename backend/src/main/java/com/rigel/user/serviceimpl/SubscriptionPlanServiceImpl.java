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

			    // 1. BASIC PLAN
			    SubscriptionPlan.builder()
			            .subscriptionName("BASIC")
			            .subscriptionCode("RASUB01")
			            .subscriptionType("YEARLY")
			            .amountPerMonth(499.0)
			            .branchCount(1)
			            .month(12)
			            .gst(1077.84)
			            .totalAmount(7065.84)
			            .status(true)
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

			    // 2. STANDARD PLAN
			    SubscriptionPlan.builder()
			            .subscriptionName("STANDARD")
			            .subscriptionCode("RASUB02")
			            .subscriptionType("YEARLY")
			            .amountPerMonth(899.0)
			            .branchCount(3)
			            .month(12)
			            .gst(1941.84)
			            .totalAmount(12729.84)
			            .status(true)
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
			            .SUKCount(20000)
			            .isMultipleBranch(true)
			            .perBranchUser(2)
			            .isMultipleUser(true)
			            .userCount(5)
			            .isRepaireAllow(true)
			            .isSalesAllow(true)
			            .isEmployeeAllow(true)
			            .perDayRepaireCount(25)
			            .perDayMobileSmartDevicesSalesCount(50)
			            .perDayComputerLaptopSalesCount(40)
			            .perDayNormalTypeSalesCount(50)
			            .isReplaceItem(true)
			            .isReturnItem(true)
			            .isDownloadInvoice(true)
			            .isfilterInventory(true)
			            .isfilterSales(true)
			            .isDownloadExcelSales(true)
			            .isDownloadExcelEntryItem(true)
			            .createdAt(LocalDateTime.now())
			            .build(),

			    // 3. PREMIUM PLAN
			    SubscriptionPlan.builder()
			            .subscriptionName("PREMIUM")
			            .subscriptionCode("RASUB03")
			            .subscriptionType("YEARLY")
			            .amountPerMonth(1499.0)
			            .branchCount(10)
			            .month(12)
			            .gst(3237.84)
			            .totalAmount(21225.84)
			            .status(true)
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
			            .isMultipleBranch(true)
			            .perBranchUser(5)
			            .isMultipleUser(true)
			            .userCount(20)
			            .isRepaireAllow(true)
			            .isSalesAllow(true)
			            .isEmployeeAllow(true)
			            .perDayRepaireCount(100)
			            .perDayMobileSmartDevicesSalesCount(200)
			            .perDayComputerLaptopSalesCount(150)
			            .perDayNormalTypeSalesCount(200)
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

			for (SubscriptionPlan sp : plans) {
			    SubscriptionPlan existing = rolesManagementDao.findBySubscriptionCode(sp.getSubscriptionCode());
			    if (existing != null) {
			        sp.setId(existing.getId());
			    }
			    rolesManagementDao.saveSubscriptionPlan(sp);
			}
		
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
		List<SubscriptionPlan> list = subscriptionPlanDao.subscriptionPlanList();
		if (list == null || list.isEmpty()) {
			saveSubscriptionPlan();
			list = subscriptionPlanDao.subscriptionPlanList();
		}
		return list;
	}

	@Override
	public List<UserSubscription> userSubscriptionPlanList(SearchCriteria searchCriteria) {
		return subscriptionPlanDao.userSubscriptionPlanList(searchCriteria);
	}

}
