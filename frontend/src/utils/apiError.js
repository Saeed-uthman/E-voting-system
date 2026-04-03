export function extractErrorMessage(error, fallbackMessage = "Something went wrong.") {
  const data = error?.response?.data;

  if (!data) return fallbackMessage;
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;

  if (data.errors && typeof data.errors === "object") {
    const firstError = Object.values(data.errors).flat().find(Boolean);
    if (firstError) return firstError;
  }

  if (typeof data.message === "string" && !data.errors) {
    return data.message;
  }

  if (typeof data === "object") {
    const firstFieldError = Object.values(data).flat().find(Boolean);
    if (firstFieldError) return firstFieldError;
  }

  return fallbackMessage;
}
