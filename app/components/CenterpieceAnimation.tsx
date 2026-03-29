'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

export default function CenterpieceAnimation() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme.palette.mode === 'dark';
  const primaryColor = isDark ? '#D0BCFF' : '#6750A4';
  const secondaryColor = isDark ? '#CCC2DC' : '#625B71';
  const accentColor = isDark ? '#9A82DB' : '#9A82DB';

  return (
    <div
      style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer progress ring */}
      <svg
        width="220"
        height="220"
        style={{
          position: 'absolute',
          transform: 'rotate(-90deg)',
        }}
      >
        <motion.circle
          cx="110"
          cy="110"
          r="100"
          stroke={`${primaryColor}15`}
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx="110"
          cy="110"
          r="100"
          stroke={primaryColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 0.75, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
          style={{
            filter: isDark 
              ? `drop-shadow(0 0 8px ${primaryColor})` 
              : `drop-shadow(0 0 6px ${primaryColor}80)`,
          }}
        />
      </svg>

      {/* Middle segmented ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: 360,
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.2 },
          scale: { duration: 0.8, delay: 0.2, ease: 'easeOut' },
          rotate: { duration: 25, repeat: Infinity, ease: 'linear' as const },
        }}
        style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
        }}
      >
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut' as const,
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${angle}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '3px',
                height: '25px',
                marginLeft: '-1.5px',
                background: secondaryColor,
                borderRadius: '2px',
                boxShadow: isDark 
                  ? `0 0 10px ${secondaryColor}80` 
                  : `0 0 8px ${secondaryColor}60`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Center hexagon with pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          scale: { 
            duration: 0.8, 
            delay: 0.4,
            ease: [0.34, 1.56, 0.64, 1] as any,
          },
        }}
        style={{
          position: 'absolute',
          width: '90px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulsing glow */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
        
        {/* Hexagon shape */}
        <svg
          width="70"
          height="70"
          viewBox="0 0 100 100"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <motion.path
            d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
            fill={isDark ? '#1C1B1F' : '#FFFFFF'}
            stroke={primaryColor}
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1, delay: 0.6, ease: 'easeInOut' as const },
              opacity: { duration: 0.3, delay: 0.6 },
            }}
            style={{
              filter: isDark 
                ? `drop-shadow(0 0 12px ${primaryColor}60)` 
                : `drop-shadow(0 0 10px ${primaryColor}50)`,
            }}
          />
          
          {/* Center tech chip icon */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5, ease: 'backOut' }}
          >
            {/* Chip body */}
            <motion.rect
              x="40"
              y="40"
              width="20"
              height="20"
              rx="2"
              fill={isDark ? '#1C1B1F' : '#FFFFFF'}
              stroke={accentColor}
              strokeWidth="2"
              style={{
                filter: `drop-shadow(0 0 8px ${accentColor}80)`,
              }}
            />
            
            {/* Chip pins - left */}
            <rect x="36" y="44" width="4" height="2" fill={accentColor} rx="0.5" />
            <rect x="36" y="50" width="4" height="2" fill={accentColor} rx="0.5" />
            <rect x="36" y="56" width="4" height="2" fill={accentColor} rx="0.5" />
            
            {/* Chip pins - right */}
            <rect x="60" y="44" width="4" height="2" fill={accentColor} rx="0.5" />
            <rect x="60" y="50" width="4" height="2" fill={accentColor} rx="0.5" />
            <rect x="60" y="56" width="4" height="2" fill={accentColor} rx="0.5" />
            
            {/* Chip pins - top */}
            <rect x="44" y="36" width="2" height="4" fill={accentColor} rx="0.5" />
            <rect x="50" y="36" width="2" height="4" fill={accentColor} rx="0.5" />
            <rect x="56" y="36" width="2" height="4" fill={accentColor} rx="0.5" />
            
            {/* Chip pins - bottom */}
            <rect x="44" y="60" width="2" height="4" fill={accentColor} rx="0.5" />
            <rect x="50" y="60" width="2" height="4" fill={accentColor} rx="0.5" />
            <rect x="56" y="60" width="2" height="4" fill={accentColor} rx="0.5" />
            
            {/* Inner detail lines */}
            <motion.line
              x1="45"
              y1="50"
              x2="55"
              y2="50"
              stroke={accentColor}
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 2, ease: 'easeInOut' }}
            />
            <motion.line
              x1="50"
              y1="45"
              x2="50"
              y2="55"
              stroke={accentColor}
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 2.2, ease: 'easeInOut' }}
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Floating accent particles */}
      {[-30, 60, 150, 240].map((angle, i) => (
        <motion.div
          key={`accent-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 4,
            delay: 1.5 + i * 1,
            repeat: Infinity,
            ease: 'easeOut' as const,
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: '-3px',
              marginTop: '-50px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 100%)`,
              boxShadow: isDark
                ? `0 0 10px ${secondaryColor}60`
                : `0 0 8px ${secondaryColor}50`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
