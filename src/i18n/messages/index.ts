import type { Locale } from "../config";
import type { Messages } from "../translate";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import zhCN from "./zh-CN.json";

// Typing against `en` makes a key missing from any other catalog a build error.
export const messages: Record<Locale, Messages> = {
  en,
  es,
  fr,
  "zh-CN": zhCN,
};
