import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box } from '@mui/material';
import { loadStore } from '../lib/storage';
import { log } from '../lib/loggingMiddleware';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function StatsPage(){
  const [links, setLinks] = useState({});
  const [open, setOpen] = useState({});

  useEffect(()=>{
    const s = loadStore();
    setLinks(s.links || {});
    log('STATS_VIEWED', {});
  }, []);

  const rows = Object.values(links).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Short Links Statistics</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Short URL</TableCell>
              <TableCell>Long URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r=>(
              <React.Fragment key={r.shortcode}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={()=>setOpen(o=>({...o, [r.shortcode]: !o[r.shortcode]}))}>
                      {open[r.shortcode] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{window.location.origin + '/' + r.shortcode}</TableCell>
                  <TableCell>{r.longUrl}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(r.expiresAt).toLocaleString()}</TableCell>
                  <TableCell>{(r.clicks || []).length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} sx={{ p:0 }}>
                    <Collapse in={open[r.shortcode]} timeout="auto" unmountOnExit>
                      <Box sx={{ p:2 }}>
                        <Typography variant="subtitle2">Click Details</Typography>
                        {(r.clicks || []).length===0 ? <Typography>No clicks yet.</Typography> :
                          (r.clicks || []).map((c,idx)=>(
                            <Box key={idx} sx={{ mb:1 }}>
                              <Typography variant="body2">{new Date(c.timestamp).toLocaleString()} — {c.referrer || 'direct'} — {c.source || 'unknown'} — {c.location || 'Unknown'}</Typography>
                            </Box>
                          ))
                        }
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
