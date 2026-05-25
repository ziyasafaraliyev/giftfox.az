import { Router } from "express";
import { contactRouter } from "./contactRoutes.js";

export const apiRouter = Router();

apiRouter.use(contactRouter);

