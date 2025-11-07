import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const ICONS: Record<string, React.ReactNode> = {
  'paw-print': <><circle cx="12" cy="16" r="4" /><circle cx="7.5" cy="10" r="2.5" /><circle cx="16.5" cy="10" r="2.5" /><circle cx="10" cy="5" r="2" /><circle cx="14" cy="5" r="2" /></>,
  syringe: <><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 4"/><path d="m9 15 4-4"/><path d="m5 19-3 3"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>,
  pill: <><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></>,
  tooth: <><path d="M20.6 10a2.9 2.9 0 0 0-1-5.2 2.8 2.8 0 0 0-3.4 1 3 3 0 0 0-5.2-2A2.8 2.8 0 0 0 7.4 5a3 3 0 0 0-1.4 6.2 2.8 2.8 0 0 0 0 5.6A2.9 2.9 0 0 0 8 22a2.8 2.8 0 0 0 3.4-1 3 3 0 0 0 5.2 2 2.8 2.8 0 0 0 3.4-1.2 3 3 0 0 0 1.4-6.2 2.8 2.8 0 0 0 0-5.6Z"/><path d="M12 12v6"/></>,
  stethoscope: <><path d="M4 14a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M6 12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M18 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-6a2 2 0 0 0-2-2Z"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/></>,
  scale: <><path d="m16 16 3-8 3 8c-.8.9-2 1.5-3.5 1.5s-2.7-.6-3.5-1.5Z"/><path d="M2 16l3-8 3 8c-.8.9-2 1.5-3.5 1.5S2.8 16.9 2 16Z"/><path d="M7.5 16h9"/><path d="M12 3v13"/><path d="M3 7h18"/></>,
  scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></>,
  plus: <><path d="M5 12h14"/><path d="M12 5v14"/></>,
  edit: <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></>,
  check: <path d="M20 6 9 17l-5-5"/>,
  x: <><path d="M18 6 6 18"/><path d="M6 6l12 12"/></>,
  trash: <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>,
  collar: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></>,
  droplet: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-2.5-1-3 0-.5 1-1 1-2 0-2.5-2-4.5-5-4.5S7 4.5 7 7c0 1 1 1.5 1 2 0 .5-1 1-1 3a7 7 0 0 0 7 7z"/>,
  'heart-pulse': <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.7-1 2.1 4.3 1.4-3.2 1.6 1.9H20.8"/></>,
};

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
};