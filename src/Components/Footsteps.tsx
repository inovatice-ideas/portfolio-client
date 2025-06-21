import React, { useEffect, useRef } from 'react';
import leftFootImg from '../assets/leftFootstep.png';
import rightFootImg from '../assets/rightFootstep.png';
import { characters, PathPoint } from './CharacterPaths';

interface Step {
  x: number;
  y: number;
  angle: number;
  isLeft: boolean;
}

const STEP_DISTANCE = 2000; // smaller distance between steps

const SIDE_OFFSET = 8; // offset to the side (perpendicular to path)

const Footsteps: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const characterStepData = useRef<Record<string, Step[]>>({});

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const interpolatePosition = (path: PathPoint[], t: number) => {
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      if (t >= p1.time && t <= p2.time) {
        const localT = (t - p1.time) / (p2.time - p1.time);
        const x = lerp(p1.x, p2.x, localT);
        const y = lerp(p1.y, p2.y, localT);
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return { x, y, angle };
      }
    }
    return null;
  };

  const distance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const animate = (
    ctx: CanvasRenderingContext2D,
    leftImg: HTMLImageElement,
    rightImg: HTMLImageElement,
    startTime: number
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const currentTime = (Date.now() - startTime) / 1000;

    characters.forEach(({ name, path, color = '#fff' }) => {
      const duration = path[path.length - 1].time;
      const time = currentTime % duration;
      const currentPos = interpolatePosition(path, time);
      if (!currentPos) return;

      const steps = characterStepData.current[name] || [];
      const lastStep = steps[steps.length - 1];

      if (
        !lastStep ||
        distance(currentPos.x, currentPos.y, lastStep.x, lastStep.y) > STEP_DISTANCE
      ) {
        const isLeft = !lastStep?.isLeft;

        // Calculate side offset
        const angle = currentPos.angle;
        const offsetAngle = angle + (isLeft ? Math.PI / 2 : -Math.PI / 2);
        const offsetX = SIDE_OFFSET * Math.cos(offsetAngle);
        const offsetY = SIDE_OFFSET * Math.sin(offsetAngle);

        steps.push({
          x: currentPos.x + offsetX,
          y: currentPos.y + offsetY,
          angle,
          isLeft,
        });

        characterStepData.current[name] = steps.slice(-20);
      }

      for (const step of steps) {
        ctx.save();
        ctx.translate(step.x, step.y);
        ctx.rotate(step.angle + Math.PI / 2); // rotate footprint correctly
        ctx.globalAlpha = 0.2;
        const img = step.isLeft ? leftImg : rightImg;
        ctx.drawImage(img, -8, -8, 16, 16);
        ctx.restore();
      }

      const latest = steps[steps.length - 1];
      if (latest) {
        ctx.font = '12px monospace';
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
        ctx.fillText(name, latest.x + 10, latest.y - 10);
      }
    });

    animationRef.current = requestAnimationFrame(() =>
      animate(ctx, leftImg, rightImg, startTime)
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const leftImg = new Image();
    const rightImg = new Image();
    let loaded = 0;

    const startAnim = () => {
      if (++loaded === 2) {
        const startTime = Date.now();
        animate(ctx, leftImg, rightImg, startTime);
      }
    };

    leftImg.src = leftFootImg;
    rightImg.src = rightFootImg;
    leftImg.onload = startAnim;
    rightImg.onload = startAnim;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
};

export default Footsteps;
