import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function AddFloatButton(props) {
    return (
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab variant="extended" size="small" color="secondary" aria-label="add" onClick={props.onclick}>
          <AddIcon sx={{ mr: 1 }} />
          {props.text}
        </Fab>
      </Box>
    );
  }