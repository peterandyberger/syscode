import dotenv from "dotenv";
dotenv.config();

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:4200";
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";