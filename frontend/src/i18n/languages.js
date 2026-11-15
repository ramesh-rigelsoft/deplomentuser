export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", isRtl: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", isRtl: false },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", isRtl: false },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", isRtl: false },
  { code: "mr", name: "Marathi", nativeName: "मराठी", isRtl: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", isRtl: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", isRtl: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", isRtl: false },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", isRtl: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", isRtl: false },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", isRtl: false },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", isRtl: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", isRtl: true },
];

export const getLanguageMeta = (code) => {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const normalized = code.trim().toLowerCase();
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === normalized) ||
    SUPPORTED_LANGUAGES[0]
  );
};
