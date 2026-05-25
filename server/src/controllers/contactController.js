import { buildContactPayload, validateContactPayload } from "../utils/contactValidation.js";

export const submitContactForm = async (req, res, next) => {
  try {
    const payload = buildContactPayload(req.body);
    const validation = validateContactPayload(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Please correct the highlighted form fields.",
        errors: validation.errors,
      });
    }

    const submission = {
      ...payload,
      submittedAt: new Date().toISOString(),
      inquiryId: `ZC-${Date.now()}`,
    };

    return res.status(201).json({
      success: true,
      message: "Your consultation request has been received. Our team will contact you shortly.",
      data: submission,
    });
  } catch (error) {
    return next(error);
  }
};

