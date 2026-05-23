export const APP_BASE_PATH = "/warranty";

export function withBasePath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${APP_BASE_PATH}${normalizedPath}`;
}
