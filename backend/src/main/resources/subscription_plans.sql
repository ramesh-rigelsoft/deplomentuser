-- ==============================================================
-- 3 Default Subscription Plans for 'subscription_plan' Table
-- ==============================================================

INSERT INTO subscription_plan (
    subscription_name, subscription_code, subscription_type, amount_per_month, month, gst, total_amount,
    branch_count, per_branch_user, is_multiple_branch, user_count, is_multiple_user,
    sukcount, is_repaire_allow, is_sales_allow, is_employee_allow,
    per_day_repaire_count, per_day_mobile_smart_devices_sales_count, per_day_computer_laptop_sales_count, per_day_normal_type_sales_count,
    is_replace_item, is_return_item, is_download_invoice, isfilter_inventory, isfilter_sales, is_download_excel_sales, is_download_excel_entry_item,
    status, permissions, created_at
) VALUES 
(
    'BASIC', 'RASUB01', 'YEARLY', 499.0, 12, 1077.84, 7065.84,
    1, 1, false, 1, false,
    5000, true, true, true,
    10, 20, 15, 20,
    true, true, true, true, true, true, true,
    true, 'DASHBOARD_VIEW,INBOUND_VIEW,INVENTORY_VIEW,OUTBOUND_VIEW,VENDOR_ADD,VENDOR_LIST,EXPENSE_VIEW,ACCOUNT_SETTING,SUMMARY_REPORT,REPAIR_CREATE,REPAIR_LIST,REPAIR_VIEW,GARBAGE_LIST,TRANSACTION_VIEW', NOW()
),
(
    'STANDARD', 'RASUB02', 'YEARLY', 899.0, 12, 1941.84, 12729.84,
    3, 2, true, 5, true,
    20000, true, true, true,
    25, 50, 40, 50,
    true, true, true, true, true, true, true,
    true, 'DASHBOARD_VIEW,INBOUND_VIEW,INVENTORY_VIEW,OUTBOUND_VIEW,VENDOR_ADD,VENDOR_LIST,EXPENSE_VIEW,ACCOUNT_SETTING,SUMMARY_REPORT,REPAIR_CREATE,REPAIR_LIST,REPAIR_VIEW,GARBAGE_LIST,TRANSACTION_VIEW', NOW()
),
(
    'PREMIUM', 'RASUB03', 'YEARLY', 1499.0, 12, 3237.84, 21225.84,
    10, 5, true, 20, true,
    50000, true, true, true,
    100, 200, 150, 200,
    true, true, true, true, true, true, true,
    true, 'DASHBOARD_VIEW,INBOUND_VIEW,INVENTORY_VIEW,OUTBOUND_VIEW,VENDOR_ADD,VENDOR_LIST,EXPENSE_VIEW,ACCOUNT_SETTING,SUMMARY_REPORT,REPAIR_CREATE,REPAIR_LIST,REPAIR_VIEW,GARBAGE_LIST,TRANSACTION_VIEW', NOW()
)
ON CONFLICT (subscription_code) DO UPDATE SET
    subscription_name = EXCLUDED.subscription_name,
    subscription_type = EXCLUDED.subscription_type,
    amount_per_month = EXCLUDED.amount_per_month,
    month = EXCLUDED.month,
    gst = EXCLUDED.gst,
    total_amount = EXCLUDED.total_amount,
    branch_count = EXCLUDED.branch_count,
    per_branch_user = EXCLUDED.per_branch_user,
    is_multiple_branch = EXCLUDED.is_multiple_branch,
    user_count = EXCLUDED.user_count,
    is_multiple_user = EXCLUDED.is_multiple_user,
    sukcount = EXCLUDED.sukcount,
    status = EXCLUDED.status,
    permissions = EXCLUDED.permissions;
