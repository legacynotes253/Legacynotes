import { db } from "./db";
import {
  notes,
  userSettings,
  type InsertNote,
  type InsertUserSettings,
  type Note,
  type UserSettings
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Notes
  getNotes(userId: string): Promise<Note[]>;
  createNote(userId: string, note: InsertNote): Promise<Note>;
  deleteNote(userId: string, id: number): Promise<void>;

  // Settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  checkInUser(userId: string): Promise<UserSettings>;
  createUserSettings(userId: string): Promise<UserSettings>;
}

export class DatabaseStorage implements IStorage {
  async getNotes(userId: string): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.userId, userId));
  }

  async createNote(userId: string, note: InsertNote): Promise<Note> {
    const [created] = await db.insert(notes).values({ 
      userId,
      recipientEmail: note.recipientEmail,
      recipientPhone: note.recipientPhone,
      title: note.title,
      content: note.content,
      attachments: note.attachments || [],
      folder: note.folder || "General",
      accessCode: note.accessCode || null,
      accessHint: note.accessHint || null,
      lastEdited: new Date()
    }).returning();
    return created;
  }

  async deleteNote(userId: string, id: number): Promise<void> {
    await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
  }

  async updateNote(userId: string, id: number, updates: Partial<InsertNote>): Promise<Note> {
    const [updated] = await db.update(notes)
      .set({ ...updates, lastEdited: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    
    if (!updated) {
      throw new Error("Note not found or unauthorized");
    }
    return updated;
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async createUserSettings(userId: string): Promise<UserSettings> {
    const [settings] = await db.insert(userSettings).values({
      userId,
      checkInFrequencyDays: 30,
      releaseDelayDays: 7,
      isVacationMode: false,
      status: 'active',
      notificationPhone: '',
    }).returning();
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    if (!existing) {
      return this.createUserSettings(userId);
    }
    const [updated] = await db.update(userSettings)
      .set(updates)
      .where(eq(userSettings.userId, userId))
      .returning();
    return updated;
  }

  async checkInUser(userId: string): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    if (!existing) {
      return this.createUserSettings(userId);
    }
    const [updated] = await db.update(userSettings)
      .set({ lastCheckIn: new Date(), status: 'active' })
      .where(eq(userSettings.userId, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
