import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Button, Typography } from '@mui/material';
import ShortenRow from './ShortenRow';
import ResultsList from './ResultsList';
import { loadStore, saveStore } from '../lib/storage';
import { generateShortcode, isValidCustom } from '../lib/shortcode';
import { isValidUrl } from '../lib/urlUtils';
import { log } from '../lib/loggingMiddleware';

export default function ShortenerPage(){
  const emptyRow = { longUrl: '', validity: '', shortcode: '', error: null };
  const [rows, setRows] = useState([ {...emptyRow} ]);
  const [results, setResults] = useState([]);

  function addRow(){
    if(rows.length >=5) return;
    setRows([...rows, {...emptyRow}]);
  }
  function updateRow(i, data){
    const n = [...rows]; n[i] = {...n[i], ...data}; setRows(n);
  }
  function removeRow(i){
    const n = rows.filter((_,idx)=>idx!==i); setRows(n);
  }

  function handleShorten(){
    const store = loadStore();
    const links = store.links || {};
    const batchResults = [];
    const errors = [];
    const usedShorts = new Set(Object.keys(links));

    // validate and process each row
    rows.forEach((r,idx)=>{
      const id = idx+1;
      if(!r.longUrl || !isValidUrl(r.longUrl)){
        errors.push({row:id, msg:'Invalid URL. Must start with http:// or https://'});
        return;
      }
      let validity = parseInt(r.validity);
      if(isNaN(validity) || validity<=0) validity = 30;
      let sc = r.shortcode && r.shortcode.trim();
      if(sc){
        if(!isValidCustom(sc)){
          errors.push({row:id, msg:'Custom shortcode invalid. Use 3-16 alphanum/_/-'});
          return;
        }
        if(usedShorts.has(sc)){
          errors.push({row:id, msg:`Shortcode "${sc}" already exists.`});
          return;
        }
      } else {
        // generate
        let attempts=0;
        do { sc = generateShortcode(6); attempts++; } while(usedShorts.has(sc) && attempts<6);
        if(usedShorts.has(sc)){ errors.push({row:id, msg:'Could not generate unique shortcode. Try again.'}); return; }
      }
      usedShorts.add(sc);
      const now = new Date();
      const createdAt = now.toISOString();
      const expiresAt = new Date(now.getTime() + validity*60000).toISOString();
      const entry = {
        shortcode: sc,
        longUrl: r.longUrl,
        createdAt,
        expiresAt,
        validityMinutes: validity,
        custom: Boolean(r.shortcode),
        clicks: []
      };
      links[sc] = entry;
      batchResults.push(entry);
    });

    log('SHORTEN_ATTEMPT', {count: rows.length});
    if(errors.length){
      log('SHORTEN_FAIL', {errors});
      alert('Some rows failed:\n' + errors.map(e=>`Row ${e.row}: ${e.msg}`).join('\n'));
    }
    if(batchResults.length){
      store.links = links;
      saveStore(store);
      setResults(batchResults);
      log('SHORTEN_SUCCESS', {created: batchResults.map(r=>r.shortcode)});
    }
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>URL Shortener (up to 5 URLs)</Typography>
          <Grid container spacing={2}>
            {rows.map((r,idx)=>(
              <Grid item xs={12} key={idx}>
                <ShortenRow value={r} onChange={(data)=>updateRow(idx,data)} onRemove={()=>removeRow(idx)} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={addRow} disabled={rows.length>=5}>Add row</Button>
              <Button variant="contained" sx={{ ml:2 }} onClick={handleShorten}>Shorten</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt:3 }}>
        <ResultsList results={results} />
      </Box>
    </Box>
  );
}
