import React from 'react';

import { IProps } from './interfaces';

const HomeIcon: React.FC<IProps> = ({
  size = 20,
  color = '#0F0F0F',
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.3583 6.67485L11.9 2.30819C10.8333 1.45819 9.16667 1.44985 8.10833 2.29985L2.65 6.67485C1.86667 7.29985 1.39167 8.54985 1.55833 9.53319L2.60833 15.8165C2.85 17.2249 4.15833 18.3332 5.58333 18.3332H14.4167C15.825 18.3332 17.1583 17.1999 17.4 15.8082L18.45 9.52485C18.6 8.54985 18.125 7.29985 17.3583 6.67485ZM10.625 14.9999C10.625 15.3415 10.3417 15.6249 10 15.6249C9.65833 15.6249 9.375 15.3415 9.375 14.9999V12.4999C9.375 12.1582 9.65833 11.8749 10 11.8749C10.3417 11.8749 10.625 12.1582 10.625 12.4999V14.9999Z"
        fill={color}
      />
    </svg>
  );
};

export default HomeIcon;
