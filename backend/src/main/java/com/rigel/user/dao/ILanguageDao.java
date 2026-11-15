package com.rigel.user.dao;

import java.util.List;
import com.rigel.user.model.LanguageMaster;

public interface ILanguageDao {

    List<LanguageMaster> getAllLanguages();

    List<LanguageMaster> getActiveLanguages();

    LanguageMaster findByCode(String languageCode);

    LanguageMaster saveLanguage(LanguageMaster language);
}
