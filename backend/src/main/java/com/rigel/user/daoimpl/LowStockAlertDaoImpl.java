package com.rigel.user.daoimpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.ILowStockAlertDao;
import com.rigel.user.model.LowStockAlert;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class LowStockAlertDaoImpl implements ILowStockAlertDao {

    @Autowired
    private EntityManager entityManager;

    @Override
    public LowStockAlert save(LowStockAlert alert) {
        if (alert.getId() != null && alert.getId() > 0) {
            alert.setUpdatedAt(LocalDateTime.now());
            return entityManager.merge(alert);
        } else {
            alert.setCreatedAt(LocalDateTime.now());
            alert.setUpdatedAt(LocalDateTime.now());
            entityManager.persist(alert);
            return alert;
        }
    }

    @Override
    public LowStockAlert findById(Long id) {
        if (id == null) {
            return null;
        }
        return entityManager.find(LowStockAlert.class, id);
    }

    @Override
    public List<LowStockAlert> findByOwner(Integer ownerId) {
        return entityManager.createQuery(
                "SELECT a FROM LowStockAlert a WHERE a.ownerId = :ownerId ORDER BY a.updatedAt DESC",
                LowStockAlert.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    @Override
    public List<LowStockAlert> findByOwnerAndBranch(Integer ownerId, String branchCode) {
        if (branchCode == null || branchCode.trim().isEmpty() || "ALL".equalsIgnoreCase(branchCode.trim())) {
            return findByOwner(ownerId);
        }
        return entityManager.createQuery(
                "SELECT a FROM LowStockAlert a WHERE a.ownerId = :ownerId AND LOWER(a.branchCode) = LOWER(:branchCode) ORDER BY a.updatedAt DESC",
                LowStockAlert.class)
                .setParameter("ownerId", ownerId)
                .setParameter("branchCode", branchCode.trim())
                .getResultList();
    }

    @Override
    public boolean updateStatus(Long id, boolean status) {
        int updated = entityManager.createQuery(
                "UPDATE LowStockAlert a SET a.status = :status, a.updatedAt = :now WHERE a.id = :id")
                .setParameter("status", status)
                .setParameter("now", LocalDateTime.now())
                .setParameter("id", id)
                .executeUpdate();
        return updated > 0;
    }

    @Override
    public boolean delete(Long id) {
        LowStockAlert alert = findById(id);
        if (alert != null) {
            entityManager.remove(alert);
            return true;
        }
        return false;
    }
}
