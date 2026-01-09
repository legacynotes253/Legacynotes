export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipientEmail: text("recipient_email"),
  recipientPhone: text("recipient_phone"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isReleased: boolean("is_released").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  checkInFrequencyDays: integer("check_in_frequency_days").default(30).notNull(),
  lastCheckIn: timestamp("last_check_in").defaultNow().notNull(),
  releaseDelayDays: integer("release_delay_days").default(7).notNull(),
  status: text("status").default("active").notNull(), // active, warning, released
});

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const insertNoteSchema = createInsertSchema(notes)
  .omit({ id: true, createdAt: true, isReleased: true, userId: true })
  .extend({
    recipientEmail: z.string().email().optional().or(z.literal("")),
    recipientPhone: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.recipientEmail || data.recipientPhone, {
    message: "Either recipient email or phone number must be provided",
    path: ["recipientEmail"],
  });

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true, userId: true, lastCheckIn: true, status: true });

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
