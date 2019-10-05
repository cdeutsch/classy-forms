import Box from '@material-ui/core/Box';
import React from 'react';

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: JSX.Element;
}

export const Page: React.SFC<PageProps> = ({ children, header, ...passthrough }) => (
  <div {...passthrough}>
    {header}
    <Box m={3}>{children}</Box>
  </div>
);
