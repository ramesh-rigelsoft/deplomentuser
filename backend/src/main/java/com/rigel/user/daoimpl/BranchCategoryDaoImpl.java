package com.rigel.user.daoimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IBranchCategoryDao;
import com.rigel.user.model.BranchCategory;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class BranchCategoryDaoImpl implements IBranchCategoryDao {

    @Autowired
    private EntityManager entityManager;

    @Override
    public BranchCategory save(BranchCategory entity) {
        if (entity.getId() != null && entity.getId() > 0) {
            entity.setUpdatedAt(LocalDateTime.now());
            return entityManager.merge(entity);
        } else {
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());
            entityManager.persist(entity);
            return entity;
        }
    }

    @Override
    public List<BranchCategory> saveAll(List<BranchCategory> entities) {
        List<BranchCategory> result = new ArrayList<>();
        for (BranchCategory entity : entities) {
            result.add(save(entity));
        }
        return result;
    }

    @Override
    public BranchCategory findById(Long id) {
        if (id == null) {
            return null;
        }
        return entityManager.find(BranchCategory.class, id);
    }

    @Override
    public List<BranchCategory> findByOwner(Integer ownerId) {
        return entityManager.createQuery(
                "SELECT b FROM BranchCategory b WHERE b.ownerId = :ownerId ORDER BY b.category ASC, b.categoryType ASC",
                BranchCategory.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    @Override
    public List<BranchCategory> findByOwnerAndBranch(Integer ownerId, String branchCode) {
        if (branchCode == null || branchCode.trim().isEmpty() || "ALL".equalsIgnoreCase(branchCode.trim())) {
            return findByOwner(ownerId);
        }
        return entityManager.createQuery(
                "SELECT b FROM BranchCategory b WHERE b.ownerId = :ownerId AND LOWER(b.branchCode) = LOWER(:branchCode) ORDER BY b.category ASC, b.categoryType ASC",
                BranchCategory.class)
                .setParameter("ownerId", ownerId)
                .setParameter("branchCode", branchCode.trim())
                .getResultList();
    }

    @Override
    public boolean exists(Integer ownerId, String branchCode, String category, String categoryType) {
        Long count = entityManager.createQuery(
                "SELECT COUNT(b) FROM BranchCategory b WHERE b.ownerId = :ownerId AND LOWER(b.branchCode) = LOWER(:branchCode) AND LOWER(b.category) = LOWER(:category) AND LOWER(b.categoryType) = LOWER(:categoryType)",
                Long.class)
                .setParameter("ownerId", ownerId)
                .setParameter("branchCode", branchCode.trim())
                .setParameter("category", category.trim())
                .setParameter("categoryType", categoryType.trim())
                .getSingleResult();
        return count != null && count > 0;
    }

    @Override
    public boolean delete(Long id) {
        BranchCategory entity = findById(id);
        if (entity != null) {
            entityManager.remove(entity);
            return true;
        }
        return false;
    }

    @Override
    public int deleteByBranch(Integer ownerId, String branchCode) {
        return entityManager.createQuery(
                "DELETE FROM BranchCategory b WHERE b.ownerId = :ownerId AND LOWER(b.branchCode) = LOWER(:branchCode)")
                .setParameter("ownerId", ownerId)
                .setParameter("branchCode", branchCode.trim())
                .executeUpdate();
    }
}
