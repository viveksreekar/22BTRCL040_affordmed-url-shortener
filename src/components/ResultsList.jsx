import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ResultsList({ results }){
  if(!results || results.length===0) return null;
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Created Short Links</Typography>
        <List>
          {results.map(r=>(
            <ListItem key={r.shortcode} secondaryAction={
              <Button startIcon={<ContentCopyIcon />} onClick={()=>{
                const url = window.location.origin + '/' + r.shortcode;
                navigator.clipboard?.writeText(url);
                alert('Copied: ' + url);
              }}>Copy</Button>
            }>
              <ListItemText primary={window.location.origin + '/' + r.shortcode} secondary={`Expires: ${new Date(r.expiresAt).toLocaleString()}`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
