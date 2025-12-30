'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, ISourceOptions } from '@tsparticles/engine';
import { Box } from '@mui/material';

// Combined snow + stars configuration (main)
const combinedOptions: ISourceOptions = {
  fullScreen: false,
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'bubble',
        parallax: {
          enable: true,
          force: 40,
          smooth: 10,
        },
      },
      onClick: {
        enable: true,
        mode: 'push',
      },
    },
    modes: {
      bubble: {
        distance: 200,
        duration: 2,
        opacity: 0.8,
        size: 6,
      },
      push: {
        quantity: 4,
      },
    },
  },
  particles: {
    color: {
      value: ['#000000', '#222222', '#444444', '#666666'],
    },
    links: {
      color: '#000000',
      distance: 120,
      enable: true,
      opacity: 0.1,
      width: 1,
    },
    move: {
      direction: 'bottom',
      enable: true,
      outModes: {
        default: 'out',
        top: 'out',
        bottom: 'out',
      },
      random: true,
      speed: {
        min: 0.5,
        max: 2,
      },
      straight: false,
      gravity: {
        enable: true,
        acceleration: 0.3,
      },
    },
    number: {
      density: {
        enable: true,
      },
      value: 60,
    },
    opacity: {
      value: {
        min: 0.1,
        max: 0.7,
      },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },
    shape: {
      type: ['circle', 'star'],
    },
    size: {
      value: {
        min: 1,
        max: 5,
      },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.03,
        opacity: 1,
        color: {
          value: '#000',
        },
      },
    },
  },
  detectRetina: true,
};

// Stars particles configuration
const starsOptions: ISourceOptions = {
  fullScreen: false,
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: '#000000',
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: true,
      speed: 0.3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 100,
    },
    opacity: {
      value: {
        min: 0.1,
        max: 1,
      },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    shape: {
      type: 'star',
    },
    size: {
      value: {
        min: 1,
        max: 4,
      },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: 1,
      },
    },
  },
  detectRetina: true,
};

// Snow particles configuration
const snowOptions: ISourceOptions = {
  fullScreen: false,
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: ['#000000', '#222222', '#444444'],
    },
    move: {
      direction: 'bottom',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: false,
      speed: 2,
      straight: false,
      gravity: {
        enable: true,
        acceleration: 0.5,
      },
    },
    number: {
      density: {
        enable: true,
      },
      value: 40,
    },
    opacity: {
      value: {
        min: 0.1,
        max: 0.6,
      },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: {
        min: 1,
        max: 5,
      },
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 10,
    },
  },
  detectRetina: true,
};

// Default particles configuration
const defaultOptions: ISourceOptions = {
  fullScreen: false,
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'grab',
        parallax: {
          enable: true,
          force: 60,
          smooth: 10,
        },
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      grab: {
        distance: 140,
        links: {
          opacity: 0.5,
          color: '#000000',
        },
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ['#000000', '#333333', '#666666', '#999999'],
    },
    links: {
      color: '#000000',
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: true,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 80,
    },
    opacity: {
      value: {
        min: 0.1,
        max: 0.5,
      },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    shape: {
      type: ['circle', 'star'],
    },
    size: {
      value: {
        min: 1,
        max: 4,
      },
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },
  },
  detectRetina: true,
};

type ParticleVariant = 'default' | 'snow' | 'stars' | 'combined';

interface ParticleBackgroundProps {
  variant?: ParticleVariant;
}

export default function ParticleBackground({ variant = 'combined' }: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container): Promise<void> => {
    // Particles container loaded
    if (container) {
      console.debug('Particles loaded:', container.id);
    }
  }, []);

  const getOptions = (): ISourceOptions => {
    switch (variant) {
      case 'snow':
        return snowOptions;
      case 'stars':
        return starsOptions;
      case 'combined':
        return combinedOptions;
      default:
        return defaultOptions;
    }
  };

  if (!init) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        '& > div': {
          pointerEvents: 'auto',
        },
      }}
    >
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={getOptions()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}
