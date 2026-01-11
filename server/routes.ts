import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendSms } from "./lib/twilio";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

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

  app.patch(api.notes.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.notes.update.input.parse(req.body);
      const userId = req.user.claims.sub;
      const note = await storage.updateNote(userId, Number(req.params.id), input);
      res.json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(404).json({ message: (err as Error).message });
    }
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

  app.post("/api/settings/test-reminder", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const settings = await storage.getUserSettings(userId);
    
    if (!settings?.notificationPhone) {
      return res.status(400).json({ message: "Please set a notification phone number first." });
    }

    try {
      await sendSms(
        settings.notificationPhone, 
        "LegacyNotes: This is a test reminder. Please check in soon to keep your account active! ✨"
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Test Route for SMS (Optional/Internal)
  app.post("/api/test-sms", isAuthenticated, async (req: any, res) => {
    const { to, message } = req.body;
    try {
      await sendSms(to, message);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
