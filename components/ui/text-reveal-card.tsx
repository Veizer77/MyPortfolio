"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
  textClassName,
  revealTextClassName,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  revealTextClassName?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  function updatePosition(clientX: number) {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      setWidthPercentage(percentage);
    }
  }

  function mouseMoveHandler(event: React.MouseEvent<HTMLDivElement>) {
    updatePosition(event.clientX);
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }

  function mouseEnterHandler(event: React.MouseEvent<HTMLDivElement>) {
    setIsMouseOver(true);
    updatePosition(event.clientX);
  }

  function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches[0]) {
      updatePosition(event.touches[0].clientX);
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1;

  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={() => setIsMouseOver(true)}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={cardRef}
      className={cn(
        "bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 dark:border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] w-full rounded-2xl p-6 sm:p-8 relative overflow-hidden select-none transition-all duration-300",
        className
      )}
    >
      {children}

      <div className="h-28 sm:h-36 relative flex items-center overflow-hidden my-2">
        <motion.div
          style={{
            width: "100%",
          }}
          animate={
            isMouseOver
              ? {
                  opacity: widthPercentage > 0 ? 1 : 0,
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
              : {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
          }
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="absolute bg-slate-900 dark:bg-slate-950 z-20 will-change-transform h-full flex items-center"
        >
          <p
            style={{
              textShadow: "0 0 25px rgba(129,140,248,0.5)",
            }}
            className={cn(
              "text-3xl sm:text-5xl md:text-6xl font-extrabold py-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 leading-tight tracking-tight",
              revealTextClassName
            )}
          >
            {revealText}
          </p>
        </motion.div>

        <motion.div
          animate={{
            left: `${widthPercentage}%`,
            rotate: `${rotateDeg}deg`,
            opacity: widthPercentage > 0 ? 1 : 0,
          }}
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="h-full w-[3px] bg-gradient-to-b from-transparent via-indigo-400 to-transparent absolute z-50 will-change-transform shadow-[0_0_15px_#818cf8]"
        />

        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]">
          <p className={cn("text-3xl sm:text-5xl md:text-6xl font-extrabold py-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 dark:from-slate-400 dark:via-slate-100 dark:to-slate-400 leading-tight tracking-tight", textClassName)}>
            {text}
          </p>
          <MemoizedStars />
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={twMerge("text-indigo-400 dark:text-indigo-300 text-sm sm:text-base font-semibold tracking-wider uppercase mb-1 flex items-center gap-2", className)}>
      {children}
    </h2>
  );
};

export const TextRevealCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={twMerge("text-slate-400 dark:text-slate-400 text-xs sm:text-sm", className)}>{children}</p>
  );
};

const Stars = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 pointer-events-none" />;
  }

  const randomMove = () => Math.random() * 4 - 2;
  const randomOpacity = () => Math.random() * 0.7 + 0.3;
  const random = () => Math.random();
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(60)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.3, 0],
          }}
          transition={{
            duration: random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            backgroundColor: "#a5b4fc",
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block shadow-[0_0_8px_#818cf8]"
        />
      ))}
    </div>
  );
};

export const MemoizedStars = memo(Stars);
