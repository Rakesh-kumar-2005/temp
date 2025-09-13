"use client";

import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Globe, Globe2, Landmark, Plane, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-400 h-5 w-5" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-green-400 h-5 w-5" />,
  },
  {
    title: "Discover hidden Gems",
    icon: <Landmark className="text-orange-500 h-5 w-5" />,
  },
  {
    title: "Adventure Destination",
    icon: <Globe className="text-yellow-500 h-5 w-5" />,
  },
];

const Hero = () => {
  const user = true;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSend = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/create-new-trip");
    }
  };

  return (
    <div className="mt-12 md:mt-24 flex w-full justify-center items-center  px-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="md:text-7xl text-3xl ml-6 lg:text-[140px] font-bold text-center text-white relative z-20 -mb-3 lg:-mb-8">
          <TextHoverEffect text="PLANORA" />
        </h1>

        {/* Sparkles Effect */}
        <div className="w-full max-w-[80rem] mx-auto h-40 relative">
          {/* Centered Gradients */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[2px] w-3/4 sm:w-2/3 md:w-1/2 blur-sm" />
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px w-3/4 sm:w-2/3 md:w-1/2" />
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[5px] w-1/2 sm:w-1/3 md:w-1/4 blur-sm" />
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px w-1/2 sm:w-1/3 md:w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={2500}
            className="w-full h-full"
            particleColor="#ffffff"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>

        {/* Input Box */}
        <div className="pt-4">
          <div className="border rounded-2xl relative shadow-md dark:border-gray-700">
            <Textarea
              placeholder="Create a trip to Ranchi..."
              className="w-full border-none bg-transparent h-28 focus-visible:ring-1 shadow-none resize-none p-4"
            />
            <Button
              className="absolute bottom-2 right-2"
              size="icon"
              onClick={onSend}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggestion List */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 pt-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-xl p-2 px-3 group hover:bg-primary transition-all duration-300 cursor-pointer text-sm md:text-base dark:border-gray-700"
            >
              <div className="group-hover:text-white">{suggestion.icon}</div>
              <h2 className="text-xs group-hover:text-white">
                {suggestion.title}
              </h2>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center flex-col mt-8 md:mt-14">
          <h2 className="my-4 text-sm md:text-lg">
            Not sure where to start?{" "}
            <strong className="text-primary">
              See how it works <ArrowRight className="inline-block" />
            </strong>
          </h2>
          <HeroVideoDialog
            className="block"
            animationStyle="from-center"
            videoSrc="/video.mp4"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
