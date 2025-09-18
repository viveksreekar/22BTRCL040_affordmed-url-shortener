export function isValidUrl(u){
  try{
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch(e){
    return false;
  }
}
