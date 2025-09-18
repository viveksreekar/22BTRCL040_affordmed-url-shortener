// Adapter to the pre-test Logging Middleware.
// For the assignment we centralize logs here.
// Replace sendLog with the real middleware call if available.

function sendLog(payload){
  // If a real middleware is provided in environment, call it here.
  // For now, keep logs in localStorage for inspection (no console.log per rules).
  try{
    const key = 'affordmed_logs_v1';
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(payload);
    localStorage.setItem(key, JSON.stringify(arr.slice(-500))); // keep last 500
  } catch(e){}
}

export function log(event, payload){
  const entry = { event, ts: new Date().toISOString(), payload };
  sendLog(entry);
}
