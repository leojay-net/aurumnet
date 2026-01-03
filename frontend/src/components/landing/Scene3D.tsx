"use client";

import { useEffect, useRef } from "react";

export function Scene3D() {
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

        // Icosahedron Definition
        const t = (1 + Math.sqrt(5)) / 2;

        let vertices = [
            [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
            [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
            [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ];

        const edges = [
            [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
            [1, 5], [1, 9], [1, 8], [1, 7],
            [2, 11], [2, 10], [2, 6], [2, 3], [2, 4],
            [3, 4], [3, 9], [3, 8], [3, 6],
            [4, 11], [4, 5], [4, 9],
            [5, 11],
            [6, 10], [6, 7], [6, 8],
            [7, 10],
            [8, 9],
            [10, 11]
        ];

        // Scale the object
        // Increased scale from 100 to 250 for a much larger presence
        vertices = vertices.map(v => [v[0] * 250, v[1] * 250, v[2] * 250]);

        let angleX = 0;
        let angleY = 0;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Center of screen
            const cx = width / 2;
            // Position: Start lower (60% down) and move slightly up with scroll for parallax
            // This adapts it to the flow of the page
            const cy = (height * 0.6) - (window.scrollY * 0.15);

            // Rotation speeds
            angleX += 0.003;
            angleY += 0.005;

            // Rotate and Project
            const projectedVertices = vertices.map(v => {
                let x = v[0];
                let y = v[1];
                let z = v[2];

                // Rotate X with scroll influence
                const currentAngleX = angleX + (window.scrollY * 0.001);
                const cosX = Math.cos(currentAngleX);
                const sinX = Math.sin(currentAngleX);
                const y1 = y * cosX - z * sinX;
                const z1 = y * sinX + z * cosX;
                y = y1;
                z = z1;

                // Rotate Y with scroll influence
                const currentAngleY = angleY + (window.scrollY * 0.001);
                const cosY = Math.cos(currentAngleY);
                const sinY = Math.sin(currentAngleY);
                const x2 = x * cosY - z * sinY;
                const z2 = x * sinY + z * cosY;
                x = x2;
                z = z2;

                // Perspective
                const fov = 800;
                const scale = fov / (fov + z + 400);

                return {
                    x: x * scale + cx,
                    y: y * scale + cy,
                    scale
                };
            });

            // Draw Edges
            ctx.lineWidth = 1.5;
            edges.forEach(edge => {
                const p1 = projectedVertices[edge[0]];
                const p2 = projectedVertices[edge[1]];

                // Calculate depth for opacity (simple fog)
                const avgScale = (p1.scale + p2.scale) / 2;
                const opacity = Math.max(0.1, avgScale - 0.2);

                // Gradient stroke
                const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity})`); // Emerald
                gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`); // Blue

                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });

            // Draw Vertices (Nodes)
            projectedVertices.forEach(p => {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.scale})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
