package com.rigel.user.superadmin.repository;

import com.rigel.user.superadmin.model.SuperAdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuperAdminAuditLogRepository extends JpaRepository<SuperAdminAuditLog, Long> {
    Page<SuperAdminAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<SuperAdminAuditLog> findTop50ByOrderByCreatedAtDesc();
}

