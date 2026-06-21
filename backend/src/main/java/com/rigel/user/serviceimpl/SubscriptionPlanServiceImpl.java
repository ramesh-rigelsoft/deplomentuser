package com.rigel.user.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.service.ISubscriptionPlanService;
import com.rigel.user.util.PagePermission;

@Service
public class SubscriptionPlanServiceImpl implements ISubscriptionPlanService {
	
	@Autowired
	IRolesManagementDao rolesManagementDao;

	@Override
	public SubscriptionPlan saveSubscriptionPlan() {
		
		List<SubscriptionPlan> plans = List.of(

			    // STANDER PLAN
			    SubscriptionPlan.builder()
			            .subscriptionName("BASIC")
			            .subscriptionCode("RASUB01")
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
			            .SUKCount(5000)
			            .isMultipleBranch(false)
			            .perBranchUser(0)
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
			            .perBranchUser(0)
			            .isMultipleUser(true)
			            .userCount(1)
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
			            .perBranchUser(0)
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
			            .build()
			);
			plans.stream().forEach(sp->{
			    rolesManagementDao.saveSubscriptionPlan(sp);
			});
		
		return null;
	}

}
