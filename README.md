# Smart Day Companion (React Native + Expo)

A 3-screen mobile helper that pairs lightweight task tracking with location-aware weather so you can plan your day with confidence. Built with Expo (TypeScript), React Navigation, Context state, AsyncStorage persistence, and Open-Meteo for real-time data. Binary assets were removed to avoid branching issues; Expo falls back to its defaults for icons and splash art.

## Quick start

```bash
# install dependencies
npm install
# if you see missing native deps, install them via Expo (fixes the datetime picker error on web)
npx expo install expo-notifications @react-native-community/datetimepicker

# start the Expo dev server (QR code for Expo Go)
npm start

# optional platform shortcuts
npm run android
npm run ios
npm run web

# lint
npm run lint
```

> If `npm install` is blocked, set your npm registry or use a VPN that can reach https://registry.npmjs.org.
> For web builds, ensure the Expo web deps are installed: `npx expo install react-native-web react-dom @expo/metro-runtime react-native-reanimated`.

## Features
- **3 screens** via bottom tabs: Home (weather + overview), Tasks (create/read/update), Resources (helpful links).
- **State management:** Context + hooks so all screens share task data.
- **Data layer:**
  - Location permission handled with friendly messaging via `expo-location`.
  - Forecast pulled from the free Open-Meteo REST API through `src/lib/api.ts`, including hourly (24-hour) and 7-day outlooks.
  - Self-care ideas fetched hourly from the Bored API with a curated offline fallback so you always see a prompt.
  - Resource links rotate hourly from a curated pool to keep the page feeling fresh.
  - Task list persisted locally with AsyncStorage.
- **Create/Read flows:** add tasks with notes, day + time reminders (local notification pop-ups), mark done, or remove.
- **Accessibility:** semantic roles (list, checkbox, button, alert), high-contrast colors, readable sizing.
- **Ready for devices:** Expo config (`app.json`) uses Expo defaults for icons/splash so no binary files are tracked; run through Expo Go or build with EAS.

## Project structure
```
App.tsx                 # Navigation + providers
src/
  context/TaskContext   # Shared task state + AsyncStorage hydration
  hooks/useWeather.ts   # Location permission + weather fetch
  lib/api.ts            # Open-Meteo client abstraction
  screens/              # Home, Tasks, Resources
  components/           # Reusable UI pieces
```

## Building for testers
- **Expo Go share:** run `npm start`, scan the QR code, or publish with `npx expo start --tunnel` when remote devices are used.
- **Native builds (EAS):**
  1. Install the CLI (`npm install -g eas-cli`).
  2. Log in (`eas login`).
  3. Configure once (`eas build:configure`).
  4. Trigger builds: `eas build -p ios --profile preview` or `eas build -p android --profile preview`.
- Upload the resulting IPA/APK or share the Expo link with testers.

## Demo outline (3–5 minutes)
1. **Home:** allow location, show live temperature/condition, scroll hourly + weekly forecast, refresh.
2. **Tasks:** add a task with notes and day/time reminder, mark complete, observe stored state and reminder pop-ups.
3. **Resources:** hourly self-care idea plus rotating external articles (auto-refreshing every hour).
4. **Close:** show QR/build flow for trying it on-device.
