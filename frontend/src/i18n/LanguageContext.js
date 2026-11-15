import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../redux/config";
import { SUPPORTED_LANGUAGES, getLanguageMeta } from "./languages";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import gu from "./locales/gu.json";
import mr from "./locales/mr.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import ml from "./locales/ml.json";
import pa from "./locales/pa.json";
import kn from "./locales/kn.json";
import orLocale from "./locales/or.json";
import as from "./locales/as.json";
import ur from "./locales/ur.json";

const TRANSLATIONS = {
  en,
  hi,
  bn,
  gu,
  mr,
  ta,
  te,
  ml,
  pa,
  kn,
  or: orLocale,
  as,
  ur,
};

// Helper to normalize keys (e.g., "Office Location" -> "office_location")
const normalizeKey = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

// Common aliases mapping
const KEY_ALIASES = {
  name: "full_name",
  full_name: "name",
  email: "email_id",
  email_id: "email",
  mobile: "mobile_number",
  mobile_no: "mobile_number",
  mobile_number: "mobile",
  action: "actions",
  actions: "action",
  active: "status_active",
  inactive: "status_inactive",
  status_active: "active",
  status_inactive: "inactive",
};

const resolveDictValue = (dict, key) => {
  if (!dict || !key || typeof key !== "string") return undefined;
  // 1. Exact match
  if (dict[key] !== undefined) return dict[key];

  const norm = normalizeKey(key);
  // 2. Normalized match
  if (dict[norm] !== undefined) return dict[norm];

  // 3. Normalized alias match
  const alias = KEY_ALIASES[norm];
  if (alias && dict[alias] !== undefined) return dict[alias];

  // 4. Special phrase matches
  if (norm.includes("manage_everything")) return dict["manage_everything"];
  if (norm.includes("welcome_back")) return dict["welcome_back"];
  if (norm.includes("manage_all_branch")) return dict["manage_all_branch_operations"];
  if (norm.includes("manage_role_based")) return dict["manage_role_based_access"];

  return undefined;
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem("app_language") || Cookies.get("language");
    return saved ? saved.trim().toLowerCase() : "en";
  });

  const [availableLanguages, setAvailableLanguages] = useState(SUPPORTED_LANGUAGES);
  const [loading, setLoading] = useState(false);

  // Apply RTL/LTR and html lang attribute whenever currentLanguage changes
  useEffect(() => {
    const meta = getLanguageMeta(currentLanguage);
    if (meta.isRtl) {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ur";
      document.body.classList.add("rtl-mode");
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = currentLanguage;
      document.body.classList.remove("rtl-mode");
    }
  }, [currentLanguage]);

  // Global DOM auto-translator: ensures all rendered labels, buttons, headers, tables,
  // badges, and placeholders across all components dynamically translate into the active language
  useEffect(() => {
    if (typeof window === "undefined" || !document.body) return;

    let isTranslating = false;
    let animationFrameId = null;

    const applyTranslations = () => {
      if (isTranslating) return;
      isTranslating = true;

      const currentDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
      const isEn = currentLanguage === "en";

      const walk = (node) => {
        if (!node) return;

        // Skip non-translatable containers
        const tag = node.nodeName ? node.nodeName.toLowerCase() : "";
        if (["script", "style", "code", "pre", "noscript", "textarea"].includes(tag)) {
          return;
        }

        // Element attributes (placeholder, title)
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.hasAttribute("placeholder")) {
            if (node.__origPlaceholder === undefined) {
              node.__origPlaceholder = node.getAttribute("placeholder");
            }
            if (isEn) {
              if (node.getAttribute("placeholder") !== node.__origPlaceholder) {
                node.setAttribute("placeholder", node.__origPlaceholder);
              }
            } else {
              const trans = resolveDictValue(currentDict, (node.__origPlaceholder || "").trim());
              if (trans && trans !== node.__origPlaceholder) {
                node.setAttribute("placeholder", trans);
              }
            }
          }

          if (node.hasAttribute("title")) {
            if (node.__origTitle === undefined) {
              node.__origTitle = node.getAttribute("title");
            }
            if (isEn) {
              if (node.getAttribute("title") !== node.__origTitle) {
                node.setAttribute("title", node.__origTitle);
              }
            } else {
              const trans = resolveDictValue(currentDict, (node.__origTitle || "").trim());
              if (trans && trans !== node.__origTitle) {
                node.setAttribute("title", trans);
              }
            }
          }
        }

        // Text Node
        if (node.nodeType === Node.TEXT_NODE) {
          const val = node.nodeValue;
          if (val) {
            const trimmed = val.trim();
            // Translate if non-empty, reasonable length, not pure numbers or currency
            if (trimmed.length > 0 && trimmed.length <= 120 && isNaN(trimmed) && !trimmed.startsWith("₹")) {
              if (node.__origText === undefined) {
                node.__origText = val;
              }

              if (isEn) {
                if (node.nodeValue !== node.__origText) {
                  node.nodeValue = node.__origText;
                }
              } else {
                const baseTrim = node.__origText.trim();
                const trans = resolveDictValue(currentDict, baseTrim);
                if (trans && trans !== baseTrim) {
                  const startIdx = node.__origText.indexOf(baseTrim);
                  const prefix = node.__origText.slice(0, startIdx);
                  const suffix = node.__origText.slice(startIdx + baseTrim.length);
                  const newVal = prefix + trans + suffix;
                  if (node.nodeValue !== newVal) {
                    node.nodeValue = newVal;
                  }
                }
              }
            }
          }
        }

        // Traverse child nodes
        let child = node.firstChild;
        while (child) {
          walk(child);
          child = child.nextSibling;
        }
      };

      try {
        walk(document.body);
      } catch (e) {
        // Safe catch
      } finally {
        isTranslating = false;
      }
    };

    const scheduleTranslate = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(applyTranslations);
    };

    scheduleTranslate();

    const observer = new MutationObserver(() => {
      if (!isTranslating) {
        scheduleTranslate();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [currentLanguage]);

  // Fetch active languages from backend if available
  const fetchAvailableLanguages = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/languages`);
      if (res?.data?.data && Array.isArray(res.data.data)) {
        const backendList = res.data.data.map((l) => ({
          code: l.languageCode,
          name: l.languageName,
          nativeName: l.nativeName,
          isRtl: l.rtl,
          active: l.active,
        }));
        if (backendList.length > 0) {
          setAvailableLanguages(backendList);
        }
      }
    } catch (e) {
      // Fallback to static SUPPORTED_LANGUAGES
      setAvailableLanguages(SUPPORTED_LANGUAGES);
    }
  }, []);

  useEffect(() => {
    fetchAvailableLanguages();
  }, [fetchAvailableLanguages]);

  // Translation function t(key, fallback)
  const t = useCallback(
    (key, fallback) => {
      if (!key) return "";
      const currentDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
      const translated = resolveDictValue(currentDict, key);
      if (translated !== undefined) {
        return translated;
      }
      // Fallback to English
      const enTranslated = resolveDictValue(TRANSLATIONS.en, key);
      if (enTranslated !== undefined) {
        return enTranslated;
      }
      return fallback !== undefined ? fallback : key;
    },
    [currentLanguage]
  );

  // Switch language locally
  const changeLanguage = useCallback((code) => {
    if (!code) return;
    const cleanCode = code.trim().toLowerCase();
    setCurrentLanguage(cleanCode);
    localStorage.setItem("app_language", cleanCode);
    Cookies.set("language", cleanCode, { expires: 30 });
  }, []);

  // Update Owner Personal Language on backend
  const updatePersonalLanguage = useCallback(
    async (code) => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const res = await axios.put(
          `${BASE_URL}/user/language`,
          { language: code },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const resolvedLang = res?.data?.data?.language || code;
        changeLanguage(resolvedLang);
        return { success: true, data: res?.data?.data };
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to update language";
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [changeLanguage]
  );

  // Reset Owner Personal Language to Account Default
  const resetPersonalLanguage = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `${BASE_URL}/user/language/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const defaultLang = res?.data?.data?.language || "en";
      changeLanguage(defaultLang);
      return { success: true, data: res?.data?.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to reset language";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [changeLanguage]);

  // Synchronize language when logging in
  const syncLoginLanguage = useCallback(
    (langCode) => {
      if (langCode) {
        changeLanguage(langCode);
      }
    },
    [changeLanguage]
  );

  // Clear language state when logging out
  const clearLanguageOnLogout = useCallback(() => {
    localStorage.removeItem("app_language");
    Cookies.remove("language");
    changeLanguage("en");
  }, [changeLanguage]);

  const value = {
    currentLanguage,
    currentMeta: getLanguageMeta(currentLanguage),
    availableLanguages,
    t,
    changeLanguage,
    updatePersonalLanguage,
    resetPersonalLanguage,
    syncLoginLanguage,
    clearLanguageOnLogout,
    fetchAvailableLanguages,
    loading,
    isRtl: getLanguageMeta(currentLanguage).isRtl,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback outside provider
    return {
      currentLanguage: "en",
      currentMeta: SUPPORTED_LANGUAGES[0],
      availableLanguages: SUPPORTED_LANGUAGES,
      t: (key, fallback) => (TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : fallback || key),
      changeLanguage: () => {},
      updatePersonalLanguage: async () => ({ success: false }),
      resetPersonalLanguage: async () => ({ success: false }),
      syncLoginLanguage: () => {},
      clearLanguageOnLogout: () => {},
      isRtl: false,
      loading: false,
    };
  }
  return context;
};

export default LanguageContext;
