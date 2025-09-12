"use client";

import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowRight, Globe, Globe2, Landmark, Plane, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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

    const onSend = () => {
        if(!user) {

        }else{
            router.push("/create-new-trip");
        }
    }

  return (
    <div className="mt-24 flex w-full justify-center">
      {/* content...  */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold">
          I'm your personal{" "}
          <span className="text-primary">AI Trip Planner</span>
        </h1>
        <p className="Text-xs">
          Tell me what you want, I'll handle the rest: Flights, Hotels, Trip
          Planning, all in seconds
        </p>
        {/* Input Box...  */}
        <div>
          <div className="border rounded-2xl relative">
            <Textarea
              placeholder="Create a trip to Paris from NewYork..."
              className="w-full border-none bg-transparent h-28 focus-visible:ring-1 shadow-none resize-none "
            />
            <Button className="absolute bottom-2 right-2" size="icon" onClick={onSend}>
              <Send />
            </Button>
          </div>
        </div>

        {/* Suggestion List...  */}
        <div className="flex gap-5 justify-center">
          {suggestions.map((suggestions, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border group rounded-xl p-2  hover:bg-primary transition-all duration-300 cursor-pointer"
            >
              {suggestions.icon}
              <h2 className="text-sm group-hover:text-white">
                {suggestions.title}
              </h2>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center flex-col">
          <h2 className="mt-14 my-7 text-lg">
            Not sure where to start?{" "}
            <strong className="text-primary">See how it works {" "} <ArrowRight className="inline-block" /></strong>
          </h2>

          {/* Video section...  */}

          <HeroVideoDialog
            className="block"
            animationStyle="from-center"
            videoSrc="https://www.example.com/dummy-video"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
