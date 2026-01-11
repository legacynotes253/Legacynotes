import { z } from 'zod';
import { insertNoteSchema, insertUserSettingsSchema, notes, userSettings } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/notes',
      responses: { 200: z.array(z.custom<typeof notes.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notes',
      input: insertNoteSchema,
      responses: { 201: z.custom<typeof notes.$inferSelect>() },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/notes/:id',
      responses: { 204: z.void() },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/notes/:id',
      input: insertNoteSchema.partial(),
      responses: { 200: z.custom<typeof notes.$inferSelect>() },
    },
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings',
      responses: { 200: z.custom<typeof userSettings.$inferSelect>() },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/settings',
      input: insertUserSettingsSchema.partial(),
      responses: { 200: z.custom<typeof userSettings.$inferSelect>() },
    },
    checkIn: {
      method: 'POST' as const,
      path: '/api/check-in',
      responses: { 200: z.custom<typeof userSettings.$inferSelect>() },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
