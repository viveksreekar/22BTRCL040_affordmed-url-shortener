const KEY = 'affordmed_url_shortener_v1';
export function loadStore(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return { meta:{version:1, createdAt: new Date().toISOString()}, links: {} };
    return JSON.parse(raw);
  } catch(err){
    throw new Error('Storage read failed: ' + err);
  }
}
export function saveStore(store){
  try{
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch(err){
    throw new Error('Storage write failed: ' + err);
  }
}
