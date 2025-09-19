# Club Manager — User & Developer Guide

This guide explains how to run, navigate, and contribute to the Club Manager mobile app (Expo + React Native). It contains both end-user instructions and developer notes so contributors and AI assistants can be productive quickly.

## Quick facts
- Tech: Expo (SDK ~53), React 19, React Native 0.79, TypeScript
- Router: `expo-router` (file-based routing under `src/app`)
- State & API: Redux Toolkit + RTK Query in `src/services/*` (e.g. `clubApi`)
- Animations: `react-native-reanimated` v3 used in some screens

## Install (developer)
1. Install dependencies:

```powershell
npm install
```

2. Start the Metro server / Expo dev tools:

```powershell
npm start
# or
npx expo start
```

3. Run on Android device/emulator:

```powershell
npm run android
```

Notes:
- Project uses native modules (`react-native-reanimated`, `react-native-gesture-handler`). When building for device or emulator use `expo run:android` / `expo run:ios` or EAS builds.

## Key user flows (App features)
- Home (Main): shows My Clubs, Dues, and Upcoming Events. Located at `src/app/(main)/index.tsx`.
- Clubs: club listing and details live under `src/app/(main)/(clubs)`.
- Events: add/view events under `src/app/(main)/(clubs)/(events)`; API payload expects keys like `title`, `description`, `event_date`, `start_time`, `end_time`, `location`, `event_type_id`, `created_by`.

## Developer notes and conventions
- File layout: `src/app` contains Expo Router pages. Grouped folders like `(main)` indicate route groups. See `index.tsx` and nested folders for route shape.
- Themed components: `src/components/themed-components/*` contains small wrappers (ThemedView, ThemedText, ThemedHeading, ThemedIcon) — use these to keep consistent styling.
- API services: `src/services/clubApi.ts` (and related files) define RTK Query endpoints. Use the provided hooks (e.g. `useGetClubQuery`, `useLazyGetClubEventsQuery`) to fetch data.
- Navigation: `expo-router` `router.push()` is used across pages; route strings often include query params encoded in the path.
- Animations: Reanimated v3 is used in screens like `upcoming_events.tsx`. The project also uses the built-in Animated API in other places.

## Common developer workflows
- Reset project (clears caches): `npm run reset-project` (see `scripts/reset-project.js`).
- Lint: `npm run lint` (uses Expo lint config)
- Tests: `npm run test` (Jest with `jest-expo`)

## Reanimated notes
- `react-native-reanimated` is included (`~3.17.4`). For local development ensure the Babel plugin is active in `babel.config.js` (look for `plugins: ['react-native-reanimated/plugin']`). If it's missing the app will crash at runtime when Reanimated components are mounted.
- Building for device/emulator requires the usual native steps (Expo prebuild or `expo run:android`).

## Troubleshooting
- Error: "A text node cannot be a child of a <View>" — wrap plain strings in `<ThemedText>` or `<Text>` (search `ThemedText` usage under `src/components`).
- Reanimated runtime errors — ensure Babel plugin is configured and that the app is restarted after changing Babel config.
- Routing type errors in TypeScript — `router.push()` sometimes expects strongly typed route strings; you can use `router.push({ pathname: '/path', params: { ... }})` to satisfy types.

## Files to review when editing UI
- `src/app/(main)/index.tsx` — main dashboard. Animations for sections applied here.
- `src/app/(main)/myclubs.tsx` — list of clubs (per-item slide-in animation implemented).
- `src/app/(main)/upcoming_events.tsx` — event cards; Reanimated slide-in implemented here.
- `src/components` — shared UI components and themed wrappers.

## Adding features
1. Identify route under `src/app` where the screen should live. Follow file-based routing conventions.
2. Use themed components for layout and typography.
3. Use RTK Query hooks for server communication; add endpoints in `src/services/*` and regenerate types as needed.
4. When using Reanimated, add entering/exiting animations or use `Animated` for smaller, JS-only effects.

## Contact / next steps
If anything in this guide is out-of-date with your local setup, tell me what changed and I will update this file.
