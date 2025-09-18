# AffordMed URL Shortener (Client-only)

This is a minimal React application that implements the Campus Hiring Evaluation requirements:
- Runs on http://localhost:3000
- Uses Material-UI
- Client-side persistence (localStorage)
- Client-side redirect handling
- Logging adapter centralised in src/lib/loggingMiddleware.js (no console.log)

To run:
1. npm install
2. npm start

Notes:
- The logging adapter currently writes logs to localStorage key 'affordmed_logs_v1'.
- Geolocation for clicks is coarse (navigator.language) due to client-only constraints.
