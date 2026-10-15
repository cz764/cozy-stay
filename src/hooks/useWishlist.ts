"use client";

import { useSyncExternalStore } from "react";

// Anonymous wishlist: listing ids in localStorage, newest first. Auth will
// move this to a Supabase table; the hook's shape is meant to survive that.
const STORAGE_KEY = "cozystay.wishlist";

const EMPTY: readonly string[] = Object.freeze([]);

// useSyncExternalStore needs a referentially stable snapshot, so the parsed
// array is cached against the raw string it came from.
let cachedRaw: string | null | undefined;
let cachedIds: readonly string[] = EMPTY;

const listeners = new Set<() => void>();

function readIds(): readonly string[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedIds;
  }
  if (raw === cachedRaw) return cachedIds;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedIds = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : EMPTY;
  } catch {
    cachedIds = EMPTY;
  }
  return cachedIds;
}

function writeIds(ids: readonly string[]) {
  cachedRaw = JSON.stringify(ids);
  cachedIds = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // Private mode or a full quota: the in-memory copy still serves this tab.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = () => EMPTY;

export function toggleWishlist(id: string) {
  const current = readIds();
  writeIds(
    current.includes(id)
      ? current.filter((saved) => saved !== id)
      : [id, ...current],
  );
}

export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, readIds, getServerSnapshot);
  return { ids, has: (id: string) => ids.includes(id), toggle: toggleWishlist };
}

const noopSubscribe = () => () => {};

// False during SSR and hydration, true afterwards; lets a page show a
// skeleton instead of a misleading empty state before storage is readable.
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
