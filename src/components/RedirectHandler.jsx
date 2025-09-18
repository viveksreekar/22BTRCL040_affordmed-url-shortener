import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { loadStore, saveStore } from '../lib/storage';
import { log } from '../lib/loggingMiddleware';
import { Box, Typography, Button } from '@mui/material';

export default function RedirectHandler(){
  const { shortcode } = useParams();
  const [status, setStatus] = useState('checking');
  const [entry, setEntry] = useState(null);

  useEffect(()=>{
    async function doRedirect(){
      try{
        const store = loadStore();
        const ent = store.links?.[shortcode];
        if(!ent){ setStatus('notfound'); log('REDIRECT_ATTEMPT', {shortcode, result:'notfound'}); return; }
        setEntry(ent);
        const now = new Date();
        if(new Date(ent.expiresAt) <= now){ setStatus('expired'); log('REDIRECT_ATTEMPT', {shortcode, result:'expired'}); return; }

        const click = {
          timestamp: now.toISOString(),
          referrer: document.referrer || 'direct',
          source: document.referrer ? 'referrer' : 'direct',
          location: (navigator.language || 'Unknown')
        };
        ent.clicks = ent.clicks || [];
        ent.clicks.push(click);
        store.links[shortcode] = ent;
        saveStore(store);
        log('CLICK_TRACKED', {shortcode, click});
        setStatus('redirecting');

        // final redirect
        window.location.replace(ent.longUrl);
      } catch(err){
        log('REDIRECT_ERROR', {shortcode, err: String(err)});
        setStatus('error');
      }
    }
    doRedirect();
  }, [shortcode]);

  if(status==='checking') return <Typography>Checking link…</Typography>;
  if(status==='notfound') return <Box><Typography>Short URL not found.</Typography><Button component={RouterLink} to="/">Go to app</Button></Box>;
  if(status==='expired') return <Box><Typography>Link expired.</Typography><Button component={RouterLink} to="/">Create new</Button></Box>;
  if(status==='error') return <Box><Typography>Something went wrong.</Typography><Button component={RouterLink} to="/">Back</Button></Box>;
  return null;
}
