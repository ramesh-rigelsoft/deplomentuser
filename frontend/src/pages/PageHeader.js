import React from "react";
import { useTranslation } from "../i18n";

export default function PageHeader({ pageName = "Dashboard" }) {
  const { t } = useTranslation();
  return (
    <div className="premium-simple-header mb-4">
      <div className="accent-bar"></div>

      <h3 className="premium-simple-title m-0">
        {t(pageName, pageName)}
      </h3>
    </div>
  );
}