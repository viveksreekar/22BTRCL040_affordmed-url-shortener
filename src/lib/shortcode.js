const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateShortcode(len=6){
  let s = '';
  for(let i=0;i<len;i++) s += CHARS.charAt(Math.floor(Math.random()*CHARS.length));
  return s;
}
export function isValidCustom(s){
  if(!s) return false;
  return /^[A-Za-z0-9_-]{3,16}$/.test(s);
}
