import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

interface ReusableTooltipProps {
  title: string;
  children: React.ReactElement;
  placement?: TooltipProps['placement'];
  arrow?: boolean;
}

const CustomTooltip: React.FC<ReusableTooltipProps> = ({
  title,
  children,
  placement = 'bottom',
  arrow = false,
}) => {
  return (
    <Tooltip title={title} placement={placement} arrow={arrow}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
