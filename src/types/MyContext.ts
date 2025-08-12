import { Request, Response } from "express";
import { AiService } from "../services/ai.service";
export interface MyContext {
  req: Request;
  res: Response;
  ai: AiService;
}
