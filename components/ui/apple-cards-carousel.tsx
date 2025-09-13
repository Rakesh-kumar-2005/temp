"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image, { ImageProps } from "next/image"; 
import { useOutsideClick } from "@/app/hooks/use-outside-click";
import { Button } from "./button";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fix 1: Add checkScrollability to useEffect dependencies
  const checkScrollability = React.useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll, checkScrollability]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Fix 2: Add window check for SSR compatibility
  const isMobile = React.useCallback(() => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  }, []);

  const handleCardClose = React.useCallback(
    (index: number) => {
      if (carouselRef.current) {
        const cardWidth = isMobile() ? 230 : 384;
        const gap = isMobile() ? 4 : 8;
        const scrollPosition = (cardWidth + gap) * (index + 1);
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        setCurrentIndex(index);
      }
    },
    [isMobile]
  );

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl"
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

/* ... other code ... */
type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  description: string;
  bestTimeToVisit: string; // New field added
};


export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [onCardClose, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, handleClose);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="absolute inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-[110%] bg-black/60 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] w-full h-full rounded-3xl bg-black/60 p-4 sm:p-6 md:p-8 lg:p-10 font-sans overflow-y-auto"
            >
              <button
                className="sticky top-0 sm:top-4 float-right ml-auto flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white transition-all duration-300 hover:scale-110 z-10 mb-4"
                onClick={handleClose}
              >
                <IconX className="h-4 w-4 sm:h-6 sm:w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              
              <div className="clear-both h-[70vh] w-[90vw]">
                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
                  
                  {/* Left Column - Content */}
                  <div className="flex flex-col">
                    <div>
                      <motion.h1
                        layoutId={layout ? `title-${card.title}` : undefined}
                        className="text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold text-neutral-800 dark:text-white mb-4 leading-tight"
                      >
                        {card.title}
                      </motion.h1>
                      
                      {/* Description */}
                      {card.description && (
                        <div className="text-xs md:text-xs lg:text-sm xl:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
                          {card.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Best Time to Visit - Bottom of left column */}
                    {card.bestTimeToVisit && (
                      <div className="mt-2">
                        <h3 className="lg:text-lg md:text-sm text-sm font-semibold text-neutral-800 dark:text-white mb-2">
                          Best Time to Visit
                        </h3>
                        <p className="text-xs lg:text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                          {card.bestTimeToVisit}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Image and Button */}
                  <div className="flex flex-col justify-end space-y-4">
                    <div className="relative flex-1">
                      <img 
                        src={card.src}
                        alt={card.title}
                        className="w-96 lg:w-full h-64 md:h-80 lg:h-[500px] xl:h-[28rem] object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Button at bottom of right column */}
                    <div className="flex justify-end">
                      <button className="w-52 hover:bg-primary flex justify-center text-primary bg-transparent hover:text-white px-2 py-3  md:py-4 rounded-lg text-base md:text-lg border border-primary font-medium transition-all shadow-lg hover:shadow-xl duration-300 transform hover:scale-105">
                      Create a Trip Here
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900 group hover:scale-105 transition-transform duration-300"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-6 sm:p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-xs sm:text-sm md:text-base font-medium text-white/90 mb-2"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="max-w-xs text-left font-sans text-lg sm:text-xl md:text-3xl font-bold [text-wrap:balance] text-white leading-tight"
          >
            {card.title}
          </motion.p>
        </div>
        <Image
          src={card.src}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          width={800}
          height={600}
          unoptimized={true}
        />
      </motion.button>
    </>
  );
};
