package com.rigel.user.serviceimpl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.ILanguageDao;
import com.rigel.user.dao.ISuperAdminDao;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleNotFound;
import com.rigel.user.model.LanguageMaster;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.User;
import com.rigel.user.service.ILanguageService;
import com.rigel.user.service.IUserService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class LanguageServiceImpl implements ILanguageService {

    @Autowired
    private ILanguageDao languageDao;

    @Autowired
    private ISuperAdminDao superAdminDao;

    @Autowired
    private IUserService userService;

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<LanguageMaster> getAllLanguages() {
        return languageDao.getAllLanguages();
    }

    @Override
    public List<LanguageMaster> getActiveLanguages() {
        return languageDao.getActiveLanguages();
    }

    @Override
    public LanguageMaster getLanguageByCode(String code) {
        return languageDao.findByCode(code);
    }

    @Override
    public LanguageMaster toggleLanguageStatus(String code, boolean active) {
        LanguageMaster lang = languageDao.findByCode(code);
        if (lang == null) {
            throw new TaskTitleNotFound("Language not found with code: " + code);
        }
        lang.setActive(active);
        lang.setUpdatedAt(LocalDateTime.now());
        return languageDao.saveLanguage(lang);
    }

    private LanguageMaster validateActiveLanguage(String code) {
        if (code == null || code.trim().isEmpty()) {
            throw new BadGatewayRequest("Language code is required.");
        }
        LanguageMaster lang = languageDao.findByCode(code.trim());
        if (lang == null) {
            throw new BadGatewayRequest("Invalid language code: " + code);
        }
        if (!lang.isActive()) {
            throw new BadGatewayRequest("Language '" + lang.getLanguageName() + "' is currently inactive.");
        }
        return lang;
    }

    @Override
    public Map<String, Object> resolveLanguage(User user, OfficeBranch branch) {
        Map<String, Object> result = new HashMap<>();
        String resolvedCode = "en";
        String resolvedName = "English";
        boolean isRtl = false;

        boolean isOwner = false;
        if (user != null) {
            String role = (user.getRole() != null) ? user.getRole().trim().toLowerCase() : "";
            isOwner = "admin".equals(role) || user.getOwnerId() <= 0 || user.getOwnerId() == user.getId();
        }

        if (isOwner) {
            // Priority:
            // 1. Owner Personal Language
            // 2. Owner Default Language
            // 3. Branch Language
            // 4. System Default ("en")
            if (user != null && user.getPersonalLanguage() != null && !user.getPersonalLanguage().trim().isEmpty()) {
                resolvedCode = user.getPersonalLanguage().trim();
            } else if (user != null && user.getDefaultLanguage() != null && !user.getDefaultLanguage().trim().isEmpty()) {
                resolvedCode = user.getDefaultLanguage().trim();
            } else if (user != null && user.getLanguage() != null && !user.getLanguage().trim().isEmpty()) {
                resolvedCode = user.getLanguage().trim();
            } else if (branch != null && branch.getLanguage() != null && !branch.getLanguage().trim().isEmpty()) {
                resolvedCode = branch.getLanguage().trim();
            }
        } else {
            // Child User Priority:
            // 1. Mapped Branch Language
            // 2. Owner Default Language
            // 3. System Default ("en")
            if (branch != null && branch.getLanguage() != null && !branch.getLanguage().trim().isEmpty()) {
                resolvedCode = branch.getLanguage().trim();
            } else if (user != null && user.getDefaultLanguage() != null && !user.getDefaultLanguage().trim().isEmpty()) {
                resolvedCode = user.getDefaultLanguage().trim();
            } else if (user != null && user.getLanguage() != null && !user.getLanguage().trim().isEmpty()) {
                resolvedCode = user.getLanguage().trim();
            }
        }

        LanguageMaster langMaster = languageDao.findByCode(resolvedCode);
        if (langMaster == null || !langMaster.isActive()) {
            // Safe fallback to "en"
            resolvedCode = "en";
            langMaster = languageDao.findByCode("en");
        }

        if (langMaster != null) {
            resolvedCode = langMaster.getLanguageCode();
            resolvedName = langMaster.getLanguageName();
            isRtl = langMaster.isRtl();
        }

        result.put("language", resolvedCode);
        result.put("languageName", resolvedName);
        result.put("isRtl", isRtl);
        result.put("defaultLanguage", resolvedCode);
        result.put("defaultLanguageName", resolvedName);

        if (user != null) {
            result.put("personalLanguage", user.getPersonalLanguage());
            LanguageMaster persMaster = (user.getPersonalLanguage() != null) ? languageDao.findByCode(user.getPersonalLanguage()) : null;
            result.put("personalLanguageName", persMaster != null ? persMaster.getLanguageName() : null);
        }

        return result;
    }

    @Override
    public OfficeBranch updateBranchLanguage(String branchCode, String languageCode) {
        validateActiveLanguage(languageCode);

        try {
            OfficeBranch branch = entityManager.createQuery(
                    "SELECT b FROM OfficeBranch b WHERE b.branchCode = :bCode", OfficeBranch.class)
                    .setParameter("bCode", branchCode)
                    .setMaxResults(1)
                    .getSingleResult();

            if (branch == null) {
                throw new TaskTitleNotFound("Branch not found with code: " + branchCode);
            }

            branch.setLanguage(languageCode.trim().toLowerCase());
            branch.setUpdatedAt(LocalDateTime.now());
            return entityManager.merge(branch);
        } catch (Exception e) {
            throw new TaskTitleNotFound("Branch not found with code: " + branchCode);
        }
    }

    @Override
    public User updateOwnerDefaultLanguage(int ownerId, String languageCode) {
        validateActiveLanguage(languageCode);

        User owner = userService.findUserById(ownerId);
        if (owner == null) {
            throw new TaskTitleNotFound("Owner not found with ID: " + ownerId);
        }

        owner.setDefaultLanguage(languageCode.trim().toLowerCase());
        owner.setLanguage(languageCode.trim().toLowerCase());
        owner.setPersonalLanguage(languageCode.trim().toLowerCase());
        return entityManager.merge(owner);
    }

    @Override
    public User updateOwnerPersonalLanguage(int userId, String languageCode) {
        validateActiveLanguage(languageCode);

        User user = userService.findUserById(userId);
        if (user == null) {
            throw new TaskTitleNotFound("User not found with ID: " + userId);
        }

        user.setPersonalLanguage(languageCode.trim().toLowerCase());
        user.setDefaultLanguage(languageCode.trim().toLowerCase());
        user.setLanguage(languageCode.trim().toLowerCase());
        return entityManager.merge(user);
    }

    @Override
    public User resetOwnerPersonalLanguage(int userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            throw new TaskTitleNotFound("User not found with ID: " + userId);
        }

        user.setPersonalLanguage(null);
        return entityManager.merge(user);
    }

    @Override
    public String getLanguageName(String code) {
        if (code == null) return "English";
        LanguageMaster lang = languageDao.findByCode(code.trim());
        return (lang != null) ? lang.getLanguageName() : "English";
    }

    @Override
    public boolean isRtl(String code) {
        if (code == null) return false;
        LanguageMaster lang = languageDao.findByCode(code.trim());
        return (lang != null) ? lang.isRtl() : false;
    }
}
