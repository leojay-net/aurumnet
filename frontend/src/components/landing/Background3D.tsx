"use client";

import { useEffect, useRef } from "react";

interface Point {
    x: number;
    y: number;
    z: number;
    baseX: number;
    baseY: number;
    baseZ: number;
    phase: number;
}

export function Background3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", resize);
        resize();

        // Configuration
        const particleCount = 100;
        const connectionDistance = 150;
        const rotationSpeed = 0.001;

        // Initialize points in a sphere/cloud
        const points: Point[] = [];
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = (Math.random() - 0.5) * 500; // Depth
            points.push({
                x, y, z,
                baseX: x,
                baseY: y,
                baseZ: z,
                phase: Math.random() * Math.PI * 2
            });
        }

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.005;
            ctx.clearRect(0, 0, width, height);

            // Center of screen
            const cx = width / 2;
            const cy = height / 2;

            // Update and project points
            const projectedPoints = points.map(p => {
                // Rotate around Y axis
                const cos = Math.cos(rotationSpeed * time * 100);
                const sin = Math.sin(rotationSpeed * time * 100);

                // Simple 3D rotation matrix (Y-axis)
                let rx = p.baseX * cos - p.baseZ * sin;
                let rz = p.baseX * sin + p.baseZ * cos;

                // Add wave motion
                let ry = p.baseY + Math.sin(time + p.phase) * 20;

                // Perspective projection
                const fov = 1000;
                const scale = fov / (fov + rz + 500); // +500 to push back

                const x2d = rx * scale + cx;
                const y2d = ry * scale + cy;
                const alpha = Math.max(0, Math.min(1, (scale - 0.5) * 2)); // Fade out distant points

                return { x: x2d, y: y2d, scale, alpha, rz };
            });

            // Draw connections
            ctx.lineWidth = 1;
            for (let i = 0; i < projectedPoints.length; i++) {
                const p1 = projectedPoints[i];
                if (p1.alpha < 0.1) continue;

                for (let j = i + 1; j < projectedPoints.length; j++) {
                    const p2 = projectedPoints[j];
                    if (p2.alpha < 0.1) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * Math.min(p1.alpha, p2.alpha) * 0.15;

                        // Check for dark mode (simple check via class on html/body or media query)
                        // For now, we use a neutral gray that works on both
                        ctx.strokeStyle = `rgba(120, 120, 120, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (const p of projectedPoints) {
                if (p.alpha < 0.05) continue;
                ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.5})`; // Emerald tint
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5 * p.scale, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none opacity-60"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
