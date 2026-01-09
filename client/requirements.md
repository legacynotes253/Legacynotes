## Packages
date-fns | Formatting dates for last check-in and release countdowns
framer-motion | Smooth transitions for cards and modals to enhance the "calm" feel
lucide-react | Iconography (already in base, but emphasizing usage)
react-hook-form | Form state management
zod | Schema validation
@hookform/resolvers | Zod resolver for react-hook-form

## Notes
Authentication is handled via Replit Auth (/api/login, /api/logout).
The app relies on `userSettings` for check-in logic.
Frontend needs to handle 401 errors gracefully by redirecting to login.
Design should use a serif font for headings (e.g., Playfair Display or similar) to convey "Legacy" and trust, and a clean sans-serif (Inter/DM Sans) for UI text.
