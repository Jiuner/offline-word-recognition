# Word Steps — Offline English Word Recognition

A fully local/offline-first English word-recognition app for young learners who already understand words by listening and need to connect sound to print.

## Windows quick start

Double-click `START_APP_WINDOWS.bat` (Python must be installed). The app opens at `http://127.0.0.1:4173/#home` and all runtime learning assets are local.

## Developer start

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/#home`.

## Tests

```bash
npm test
npm run test:smoke
npm run test:all
```

## Architecture

- HTML / CSS / Vanilla JavaScript
- IndexedDB learning data
- Local JSON word dataset
- Local WebP real-photo assets
- Local MP3 word/chunk audio
- Service Worker + PWA manifest
- JSON backup / restore
- No remote runtime APIs or cloud database
