import React from 'react';

interface KonarkWheelProps {
  className?: string;
  size?: number;
  color?: string;
  animate?: boolean;
}

export const KonarkWheel: React.FC<KonarkWheelProps> = ({
  className = 'w-6 h-6',
  size = 24,
  color = '#B8543A',
  animate = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? 'animate-konark-slow' : ''}`}
      aria-label="Konark Sun Wheel Motifs"
    >
      {/* Outer Rim */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="3" opacity="0.85" />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      
      {/* Central Axle & Hub */}
      <circle cx="50" cy="50" r="14" fill="#F7F1E5" stroke={color} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="7" fill={color} />
      <circle cx="50" cy="50" r="3" fill="#F7F1E5" />

      {/* 8 Primary Major Spokes (Ornate Diamond Geometry) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <g key={idx} transform={`rotate(${angle} 50 50)`}>
          <line x1="50" y1="14" x2="50" y2="36" stroke={color} strokeWidth="2.5" />
          <polygon
            points="50,22 47,27 50,32 53,27"
            fill={color}
            opacity="0.9"
          />
          <circle cx="50" cy="43.5" r="2" fill={color} />
        </g>
      ))}

      {/* 8 Secondary Minor Spokes */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
        <g key={`minor-${idx}`} transform={`rotate(${angle} 50 50)`}>
          <line x1="50" y1="14" x2="50" y2="36" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
};
