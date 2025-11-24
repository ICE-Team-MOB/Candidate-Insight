export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
}