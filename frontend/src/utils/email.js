export const validEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email?.trim());
};

export const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return "";
  const trimmed = email.trim().toLowerCase();
  const [localPart, domain] = trimmed.split("@");
  if (!domain) return trimmed;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    const cleanedLocal = localPart.split("+")[0].replace(/\./g, "");
    return `${cleanedLocal}@gmail.com`;
  }
  return trimmed;
};
