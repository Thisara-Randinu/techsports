'use client';

import { motion } from 'framer-motion';
import { Box, Container, Typography, Button, IconButton, Stack, Chip } from '@mui/material';
import { useThemeMode } from '../ThemeRegistry';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect, useState } from 'react';
import BouncingShapes from './BouncingShapes';
import CenterpieceAnimation from './CenterpieceAnimation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};



export default function UnderConstruction() {
  const { mode, toggleTheme } = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: mode === 'dark'
          ? 'linear-gradient(135deg, #1C1B1F 0%, #2D2A33 50%, #1C1B1F 100%)'
          : 'linear-gradient(135deg, #FEF7FF 0%, #F6EDFF 50%, #FEF7FF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Bouncing and morphing shapes animation */}
      <BouncingShapes />

      {/* Theme Toggle */}
      <Box sx={{ position: 'absolute', top: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 }, zIndex: 10 }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            onClick={toggleTheme}
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              bgcolor: mode === 'dark' ? 'rgba(208, 188, 255, 0.1)' : 'rgba(103, 80, 164, 0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(208, 188, 255, 0.2)' : 'rgba(103, 80, 164, 0.2)',
              },
            }}
          >
            {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>
        </motion.div>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          {/* Status Chip */}
          <motion.div variants={itemVariants}>
            <Chip
              icon={<AccessTimeIcon fontSize="small" />}
              label="Coming Soon"
              sx={{
                mb: { xs: 3, sm: 4 },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 2.5, sm: 3 },
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                fontWeight: 500,
                bgcolor: mode === 'dark' ? 'rgba(208, 188, 255, 0.15)' : 'rgba(103, 80, 164, 0.15)',
                color: mode === 'dark' ? '#D0BCFF' : '#6750A4',
                border: `1px solid ${mode === 'dark' ? 'rgba(208, 188, 255, 0.3)' : 'rgba(103, 80, 164, 0.3)'}`,
              }}
            />
          </motion.div>

          {/* Centerpiece Animation */}
          <motion.div
            variants={itemVariants}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 32,
              transform: 'scale(0.85)',
            }}
            sx={{
              '@media (min-width: 600px)': {
                marginBottom: 48,
                transform: 'scale(1)',
              }
            }}
          >
            <CenterpieceAnimation />
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                mb: { xs: 2, sm: 3 },
                fontWeight: 400,
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                lineHeight: { xs: 1.2, sm: 1.1 },
                px: { xs: 1, sm: 0 },
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #D0BCFF 0%, #CCC2DC 100%)'
                  : 'linear-gradient(135deg, #6750A4 0%, #4F378B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Under Construction
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="body1"
              sx={{
                mb: { xs: 4, sm: 5 },
                fontSize: { xs: '0.9375rem', sm: '1.125rem' },
                color: mode === 'dark' ? '#CAC4D0' : '#49454F',
                maxWidth: 600,
                mx: 'auto',
                px: { xs: 2, sm: 0 },
                lineHeight: { xs: 1.6, sm: 1.8 },
              }}
            >
              We're crafting something extraordinary for you. Our team is working hard to bring you 
              an amazing experience. Stay tuned for the big reveal!
            </Typography>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              justifyContent="center"
              alignItems="center"
              sx={{ 
                mb: { xs: 4, sm: 6 },
                px: { xs: 2, sm: 0 },
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                style={{ width: '100%', maxWidth: '280px' }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<RocketLaunchIcon />}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.9375rem', sm: '1rem' },
                    background: mode === 'dark'
                      ? 'linear-gradient(135deg, #6750A4 0%, #9A82DB 100%)'
                      : 'linear-gradient(135deg, #6750A4 0%, #4F378B 100%)',
                    boxShadow: mode === 'dark'
                      ? '0 4px 20px rgba(208, 188, 255, 0.3)'
                      : '0 4px 20px rgba(103, 80, 164, 0.3)',
                    '&:hover': {
                      boxShadow: mode === 'dark'
                        ? '0 6px 24px rgba(208, 188, 255, 0.4)'
                        : '0 6px 24px rgba(103, 80, 164, 0.4)',
                    },
                  }}
                >
                  Notify Me
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                style={{ width: '100%', maxWidth: '280px' }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.9375rem', sm: '1rem' },
                    borderColor: mode === 'dark' ? '#D0BCFF' : '#6750A4',
                    color: mode === 'dark' ? '#D0BCFF' : '#6750A4',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: mode === 'dark' ? '#EADDFF' : '#4F378B',
                      bgcolor: mode === 'dark' ? 'rgba(208, 188, 255, 0.08)' : 'rgba(103, 80, 164, 0.08)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </Stack>
          </motion.div>


        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          pb: { xs: 3, sm: 4 },
          pt: { xs: 2, sm: 0 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: mode === 'dark' ? '#938F99' : '#625B71',
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            px: 2,
          }}
        >
          © 2026 TechSports. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
