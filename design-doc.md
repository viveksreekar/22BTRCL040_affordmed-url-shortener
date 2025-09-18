# Design Document — AffordMed URL Shortener

(Concise summary for submission)

## Architecture
- React single-page app using React Router.
- Pages: Shortener (/) , Stats (/stats), Redirect handler (/:shortcode).
- Material-UI used for all UI components.
- All events routed through a centralized logging adapter (src/lib/loggingMiddleware.js).

## Data Model (localStorage)
Key: `affordmed_url_shortener_v1`
Structure:
- meta: version, createdAt
- links: { shortcode: {shortcode, longUrl, createdAt, expiresAt, validityMinutes, custom, clicks:[] } }

## Shortcodes
- Custom shortcode validation: `^[A-Za-z0-9_-]{3,16}$`.
- Auto-generated: base62 6 chars. Collision retry implemented.

## Validity & Expiry
- Default validity: 30 minutes
- Expiry checked on redirect; expired links do not redirect.

## Click Tracking
- Stores timestamp, referrer (document.referrer), source (referrer/direct), location (navigator.language fallback).
- Logs click via logging middleware.

## Logging
- All important events are logged: SHORTEN_ATTEMPT, SHORTEN_SUCCESS, SHORTEN_FAIL, REDIRECT_ATTEMPT, CLICK_TRACKED, STATS_VIEWED, STORAGE_ERROR.
- Adapter writes logs to localStorage for offline inspection.

## Limitations
- No server-side persistence: data limited to user browser.
- Geolocation/coarse location limited: accurate country detection requires server-side IP geolocation.
- LocalStorage security limitations noted.

## Run
- `npm install`
- `npm start` (app serves on http://localhost:3000)
