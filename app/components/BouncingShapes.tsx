'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  borderRadius: number;
  color: string;
  duration: number;
}

const SHAPES_COUNT = 8;

export default function BouncingShapes() {
  const theme = useTheme();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [mounted, setMounted] = useState(false);

  const colors = theme.palette.mode === 'dark'
    ? [
        'rgba(208, 188, 255, 0.15)', // Primary
        'rgba(204, 194, 220, 0.15)', // Secondary
        'rgba(154, 130, 219, 0.12)', // Primary light
        'rgba(184, 169, 204, 0.12)', // Secondary light
        'rgba(103, 80, 164, 0.18)',  // Primary dark
        'rgba(98, 91, 113, 0.15)',   // Secondary dark
      ]
    : [
        'rgba(103, 80, 164, 0.12)',  // Primary
        'rgba(98, 91, 113, 0.12)',   // Secondary
        'rgba(154, 130, 219, 0.1)',  // Primary light
        'rgba(147, 143, 153, 0.1)',  // Secondary light
        'rgba(79, 55, 139, 0.15)',   // Primary dark
        'rgba(74, 68, 88, 0.12)',    // Secondary dark
      ];

  useEffect(() => {
    setMounted(true);
    
    const initialShapes: Shape[] = Array.from({ length: SHAPES_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 80 + Math.random() * 120,
      rotation: Math.random() * 360,
      borderRadius: Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 8 + Math.random() * 8,
    }));

    setShapes(initialShapes);
  }, [theme.palette.mode]);

  if (!mounted || shapes.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {shapes.map((shape) => (
        <AnimatedShape key={shape.id} shape={shape} colors={colors} />
      ))}
    </div>
  );
}

function AnimatedShape({ shape, colors }: { shape: Shape; colors: string[] }) {
  const [targetPosition, setTargetPosition] = useState({ x: shape.x, y: shape.y });
  const [targetShape, setTargetShape] = useState({
    borderRadius: shape.borderRadius,
    rotation: shape.rotation,
  });

  useEffect(() => {
    const changePosition = () => {
      setTargetPosition({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      });
    };

    const changeShape = () => {
      // Material 3 expressive border radius values
      const borderRadiusOptions = [0, 8, 16, 28, 50]; // From sharp to pill
      setTargetShape({
        borderRadius: borderRadiusOptions[Math.floor(Math.random() * borderRadiusOptions.length)],
        rotation: Math.random() * 360,
      });
    };

    changePosition();
    changeShape();

    const positionInterval = setInterval(changePosition, shape.duration * 1000);
    const shapeInterval = setInterval(changeShape, (shape.duration * 0.7) * 1000);

    return () => {
      clearInterval(positionInterval);
      clearInterval(shapeInterval);
    };
  }, [shape.duration]);

  return (
    <motion.div
      initial={{
        left: `${shape.x}%`,
        top: `${shape.y}%`,
        width: shape.size,
        height: shape.size,
        rotate: shape.rotation,
        borderRadius: `${shape.borderRadius}%`,
      }}
      animate={{
        left: `${targetPosition.x}%`,
        top: `${targetPosition.y}%`,
        rotate: targetShape.rotation,
        borderRadius: `${targetShape.borderRadius}%`,
      }}
      transition={{
        type: 'spring',
        stiffness: 20,
        damping: 15,
        mass: 1.2,
        duration: shape.duration,
      }}
      style={{
        position: 'absolute',
        background: shape.color,
        backdropFilter: 'blur(40px)',
        filter: 'blur(30px)',
        boxShadow: `0 0 60px ${shape.color}`,
      }}
    />
  );
}
