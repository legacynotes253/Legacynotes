import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // Notes Routes
  app.get(api.notes.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const notes = await storage.getNotes(userId);
    res.json(notes);
  });

  app.post(api.notes.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.notes.create.input.parse(req.body);
      const userId = req.user.claims.sub;
      const note = await storage.createNote(userId, input);
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.notes.delete.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    await storage.deleteNote(userId, Number(req.params.id));
    res.status(204).send();
  });

  // Settings Routes
  app.get(api.settings.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    let settings = await storage.getUserSettings(userId);
    if (!settings) {
      settings = await storage.createUserSettings(userId);
    }
    res.json(settings);
  });

  app.patch(api.settings.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const userId = req.user.claims.sub;
      const settings = await storage.updateUserSettings(userId, input);
      res.json(settings);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.settings.checkIn.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const settings = await storage.checkInUser(userId);
    res.json(settings);
  });

  return httpServer;
}
