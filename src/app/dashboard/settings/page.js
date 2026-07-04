"use client";

import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import DashboardSettingsPage from "@/components/dashboard/DashboardSettingsPage";
import { isLightThemeId } from "@/theme";

export default function SettingsPage() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  return <DashboardSettingsPage light={light} />;
}
