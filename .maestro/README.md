# Maestro flows

End-to-end checks of the iOS app on a simulator: the screens a learner
actually uses, driven by taps, the way unit tests and type checks cannot.

## Run

1. Build and install the development client once: `npx expo run:ios`.
2. Start the bundler: `npx expo start --dev-client`.
3. Run every flow: `npm run test:e2e` (or `maestro test .maestro/<flow>.yaml`).

Maestro needs Java 17+ and the Maestro CLI (https://maestro.mobile.dev).

## Flows

| Flow | What it proves |
|---|---|
| `navigation.yaml` | The three tabs open, and Course opens a module page. |
| `lesson.yaml` | A question can be answered and checked, the feedback sheet appears with the explanation, and Continue moves on. |
| `reminder.yaml` | Turning on the daily reminder asks for permission and, once allowed, offers the times. |

Each flow starts the app through the development client's URL
(`subflows/launch.yaml`), so the bundler must be running on port 8081.
Maestro runs only the files at the top of this folder; shared steps live in
`subflows/`.
