import type en from "./messages/en.json";

export type Messages = typeof en;

type Vars = Record<string, string | number>;

// A leaf is either a string or a CLDR plural object; the dotted key points at
// the leaf, and `t` picks the form from `vars.count`.
type Leaf = string | { other: string };

type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Leaf
    ? `${Prefix}${K}`
    : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Paths<Messages>;

export type Translate = (key: MessageKey, vars?: Vars) => string;

export function createT(locale: string, messages: Messages): Translate {
  const pluralRules = new Intl.PluralRules(locale);

  return (key, vars = {}) => {
    const leaf = key
      .split(".")
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === "object"
            ? (node as Record<string, unknown>)[part]
            : undefined,
        messages,
      );

    let template: string;
    if (typeof leaf === "string") {
      template = leaf;
    } else if (leaf && typeof leaf === "object" && "other" in leaf) {
      const forms = leaf as Record<string, string | undefined>;
      const count = vars.count;
      template =
        (typeof count === "number" && forms[pluralRules.select(count)]) ||
        (forms.other as string);
    } else {
      // Surface a missing key in the UI instead of crashing the render.
      return key;
    }

    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}
