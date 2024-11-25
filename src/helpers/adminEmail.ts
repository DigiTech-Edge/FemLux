// List of admin emails
const ADMIN_EMAILS = [
  "isinesam@gmail.com",
  // Add more admin emails here
];

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const getUserRole = (email: string): "admin" | "user" => {
  return isAdminEmail(email) ? "admin" : "user";
};
