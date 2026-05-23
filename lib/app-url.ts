import { APP_BASE_PATH } from "./base-path";

const fallbackAppUrl = `http://localhost:3000${APP_BASE_PATH}`;

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? fallbackAppUrl;
}
