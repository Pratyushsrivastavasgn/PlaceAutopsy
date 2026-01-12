import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import './MagicBento.css';

interface MagicBentoProps {
  children: React.ReactNode;
  className?: string;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  autoHeight?: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export const MagicBento: React.FC<MagicBentoProps> = ({
  children,
  className,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = '132, 0, 255',
  autoHeight = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Generate stars on mount
  useEffect(() => {
    if (enableStars) {
      const newStars: Star[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 1.5,
      }));
      setStars(newStars);
    }
  }, [enableStars]);

  // Generate particles on mount
  useEffect(() => {
    if (particleCount > 0) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 3,
      }));
      setParticles(newParticles);
    }
  }, [particleCount]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Update CSS variables for glow effect
    if (enableBorderGlow) {
      cardRef.current.style.setProperty('--glow-x', `${x}px`);
      cardRef.current.style.setProperty('--glow-y', `${y}px`);
      cardRef.current.style.setProperty('--glow-intensity', '1');
      cardRef.current.style.setProperty('--glow-radius', `${spotlightRadius}px`);
    }

    // Tilt effect
    if (enableTilt) {
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      gsap.to(cardRef.current, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Magnetism effect - subtle pull towards cursor
    if (enableMagnetism) {
      const moveX = ((x - centerX) / centerX) * 3;
      const moveY = ((y - centerY) / centerY) * 3;
      
      gsap.to(cardRef.current, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Spotlight effect
    if (enableSpotlight && spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        x: x - spotlightRadius / 2,
        y: y - spotlightRadius / 2,
        opacity: 0.15,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  }, [enableBorderGlow, enableTilt, enableMagnetism, enableSpotlight, spotlightRadius]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    // Reset glow
    if (enableBorderGlow) {
      cardRef.current.style.setProperty('--glow-intensity', '0');
    }

    // Reset tilt and magnetism
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Hide spotlight
    if (enableSpotlight && spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [enableBorderGlow, enableSpotlight]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickEffect || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples(prev => [...prev, { id: rippleId, x, y }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);
  }, [clickEffect]);

  const cardClasses = cn(
    'magic-bento-card',
    textAutoHide && 'magic-bento-card--text-autohide',
    enableBorderGlow && 'magic-bento-card--border-glow',
    enableTilt && 'magic-bento-card--tilt',
    autoHeight && 'magic-bento-card--auto-height',
    className
  );

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        '--glow-color': glowColor,
      } as React.CSSProperties}
    >
      {/* Stars */}
      {enableStars && stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `rgba(${glowColor}, 0.6)`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Spotlight */}
      {enableSpotlight && (
        <div
          ref={spotlightRef}
          className="global-spotlight"
          style={{
            width: spotlightRadius,
            height: spotlightRadius,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 70%)`,
            opacity: 0,
          }}
        />
      )}

      {/* Click ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, transparent 70%)`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Grid container for bento layout
interface MagicBentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const MagicBentoGrid: React.FC<MagicBentoGridProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('card-grid', className)}>
      {children}
    </div>
  );
};

export default MagicBento;
