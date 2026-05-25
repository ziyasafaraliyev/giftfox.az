import { Router } from "express";
import { submitContactForm } from "../controllers/contactController.js";

export const contactRouter = Router();

contactRouter.post("/contact", submitContactForm);

