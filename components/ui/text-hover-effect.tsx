"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - svgRect.left) / svgRect.width) * 100;
      const y = ((e.clientY - svgRect.top) / svgRect.height) * 100;
      setCursor({ x, y });
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1000 200"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none -translate-x-7"
      style={{ margin: 0, padding: 0 }}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          cx={`${cursor.x}%`}
          cy={`${cursor.y}%`}
          animate={{
            r: hovered ? "40%" : "0%",
          }}
          transition={{ duration: duration ?? 0.4, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-[180px] font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 1 : 0.6, margin: 0, padding: 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-[180px] font-bold"
        style={{ margin: 0, padding: 0 }}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="3"
        mask="url(#textMask)"
        className="fill-white font-[helvetica] text-[180px] font-bold"
        style={{ margin: 0, padding: 0 }}
      >
        {text}
      </text>
    </svg>
  );
};