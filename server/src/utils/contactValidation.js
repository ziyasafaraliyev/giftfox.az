const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;

const cleanValue = (value) => (typeof value === "string" ? value.trim() : "");

export const buildContactPayload = (body = {}) => ({
  name: cleanValue(body.name),
  phone: cleanValue(body.phone),
  email: cleanValue(body.email),
  service: cleanValue(body.service),
  message: cleanValue(body.message),
});

export const validateContactPayload = (payload) => {
  const errors = {};

  if (!payload.name || payload.name.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }

  if (!payload.phone || !PHONE_REGEX.test(payload.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!payload.email || !EMAIL_REGEX.test(payload.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!payload.service) {
    errors.service = "Please select the service you are interested in.";
  }

  if (!payload.message || payload.message.length < 20) {
    errors.message = "Project message must be at least 20 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
