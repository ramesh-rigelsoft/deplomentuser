package com.rigel.user.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.ILanguageDao;
import com.rigel.user.model.LanguageMaster;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class LanguageDaoImpl implements ILanguageDao {

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<LanguageMaster> getAllLanguages() {
        return entityManager.createQuery(
                "SELECT l FROM LanguageMaster l ORDER BY l.id ASC", LanguageMaster.class)
                .getResultList();
    }

    @Override
    public List<LanguageMaster> getActiveLanguages() {
        return entityManager.createQuery(
                "SELECT l FROM LanguageMaster l WHERE l.active = true ORDER BY l.id ASC", LanguageMaster.class)
                .getResultList();
    }

    @Override
    public LanguageMaster findByCode(String languageCode) {
        if (languageCode == null || languageCode.trim().isEmpty()) {
            return null;
        }
        try {
            return entityManager.createQuery(
                    "SELECT l FROM LanguageMaster l WHERE LOWER(l.languageCode) = LOWER(:code)", LanguageMaster.class)
                    .setParameter("code", languageCode.trim())
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public LanguageMaster saveLanguage(LanguageMaster language) {
        if (language.getId() > 0) {
            return entityManager.merge(language);
        } else {
            entityManager.persist(language);
            return language;
        }
    }
}
