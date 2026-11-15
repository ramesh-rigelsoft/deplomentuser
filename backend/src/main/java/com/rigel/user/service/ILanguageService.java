package com.rigel.user.service;

import java.util.List;
import java.util.Map;

import com.rigel.user.model.LanguageMaster;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.User;

public interface ILanguageService {

    List<LanguageMaster> getAllLanguages();

    List<LanguageMaster> getActiveLanguages();

    LanguageMaster getLanguageByCode(String code);

    LanguageMaster toggleLanguageStatus(String code, boolean active);

    Map<String, Object> resolveLanguage(User user, OfficeBranch branch);

    OfficeBranch updateBranchLanguage(String branchCode, String languageCode);

    User updateOwnerDefaultLanguage(int ownerId, String languageCode);

    User updateOwnerPersonalLanguage(int userId, String languageCode);

    User resetOwnerPersonalLanguage(int userId);

    String getLanguageName(String code);

    boolean isRtl(String code);
}
