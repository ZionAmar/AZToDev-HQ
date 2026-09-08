import path from "path";
import { OPS, readJson, writeJson, nowIso } from "./paths.mjs";

export const FACTORY_PATH = path.join(OPS, "config", "factory.json");

export function readFactory() {
  return readJson(FACTORY_PATH, {});
}

export function writeFactory(patch) {
  const cur = readFactory();
  const next = { ...cur, ...patch, updatedAt: nowIso().slice(0, 10) };
  writeJson(FACTORY_PATH, next);
  return next;
}

/** Founder order: company may exist without touching any product repo. */
export function isProductWorkEnabled() {
  return readFactory().productWorkEnabled === true;
}

export function companyMode() {
  return readFactory().mode || "standby";
}
