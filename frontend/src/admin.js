export const ADMIN_EMAIL = "alexander3684@gmail.com";
export const ADMIN_PIN = "1321";

export function isAdminActive() {
  return localStorage.getItem("rar_admin") === "true";
}

export function activateAdmin() {
  localStorage.setItem("rar_admin", "true");
}

export function deactivateAdmin() {
  localStorage.removeItem("rar_admin");
}