"use client";

import { createContext, useContext, useMemo } from "react";

import type { Locale } from "./config";
import { createT, type Messages, type Translate } from "./translate";

interface I18nContextValue {
  locale: Locale;
  t: Translate;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nProviderProps) {
  const value = useMemo(
    () => ({ locale, t: createT(locale, messages) }),
    [locale, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useT/useLocale must be used inside <I18nProvider>");
  }
  return context;
}

export function useT() {
  return useI18n().t;
}

export function useLocale() {
  return useI18n().locale;
}
