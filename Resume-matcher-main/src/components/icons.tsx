import type {SVGProps} from 'react';

export const ProductHuntIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 12h-3v-4h3c1.1 0 2 .9 2 2s-.9 2-2 2z" />
  </svg>
);

export const BlueSkyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    {...props}
  >
    <path d="M13 18.22c-3.32-2.2-4.14-6.22-3.1-9.32a4.48 4.48 0 0 1 8.21-.01c1.04 3.1-.78 7.12-3.1 9.32" />
    <path d="M2.42 16.14c-1.1-2.73.08-5.8.52-6.52s1.42-1.42 1.42-1.42a2.84 2.84 0 0 1 4.02 0L12 12" />
    <path d="m18.58 7.86c1.1 2.73-.08 5.8-.52 6.52s-1.42 1.42-1.42 1.42a2.84 2.84 0 0 1-4.02 0L12 12" />
  </svg>
);
