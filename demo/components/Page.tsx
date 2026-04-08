import Box from '@mui/material/Box';
import React from 'react';

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactElement;
}

export const Page: React.FC<PageProps> = ({ children, header, ...passthrough }) => (
  <div {...passthrough}>
    {header}
    <Box sx={{ m: 3 }}>{children}</Box>
  </div>
);
