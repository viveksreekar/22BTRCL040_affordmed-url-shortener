import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ShortenRow({ value, onChange, onRemove }){
  return (
    <Box display="flex" gap={1} alignItems="center">
      <TextField fullWidth label="Long URL" value={value.longUrl} onChange={e=>onChange({ longUrl: e.target.value })} />
      <TextField sx={{ width:140 }} label="Validity (mins)" type="number" value={value.validity} onChange={e=>onChange({ validity: e.target.value })} />
      <TextField sx={{ width:160 }} label="Custom shortcode (opt)" value={value.shortcode} onChange={e=>onChange({ shortcode: e.target.value })} />
      <IconButton onClick={onRemove}><DeleteIcon /></IconButton>
    </Box>
  );
}
