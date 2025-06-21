import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  twinkleSpeed: number;
  glowSize: number;
}

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  const colors = [
    'rgba(255, 107, 107, 0.8)',  // Coral
    'rgba(78, 205, 196, 0.8)',   // Turquoise
    'rgba(135, 206, 250, 0.8)',  // Sky Blue
    'rgba(255, 215, 0, 0.8)',    // Gold
    'rgba(147, 112, 219, 0.8)',  // Medium Purple
  ];

  const createParticle = (): Particle => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.5 + 0.5, // Smaller size for more sparkle-like appearance
    speedX: (Math.random() - 0.5) * 0.3, // Slower speed
    speedY: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.5 + 0.5, // Random initial opacity
    twinkleSpeed: Math.random() * 0.02 + 0.01, // Random twinkle speed
    glowSize: Math.random() * 2 + 1 // Random glow size
  });

  const initParticles = () => {
    const particleCount = Math.floor(window.innerWidth * window.innerHeight / 8000); // Increased density
    particlesRef.current = Array.from({ length: particleCount }, createParticle);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Update opacity for twinkling effect
      particle.opacity += particle.twinkleSpeed;
      if (particle.opacity > 1 || particle.opacity < 0.3) {
        particle.twinkleSpeed = -particle.twinkleSpeed;
      }

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.glowSize
      );
      gradient.addColorStop(0, particle.color.replace('0.8', particle.opacity.toString()));
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw particle core
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace('0.8', particle.opacity.toString());
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    initParticles();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  );
};

export default Particles; 