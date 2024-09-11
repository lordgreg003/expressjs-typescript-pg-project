import { RequestHandler } from "express";
interface AdminController {
  health: RequestHandler;
  register: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
  getById: RequestHandler;
  getAll: RequestHandler;
}

export default AdminController;
