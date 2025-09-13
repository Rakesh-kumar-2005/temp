"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Camera, 
  TreePine, 
  Mountain, 
  Waves,
  Users,
  Info,
  Navigation,
  Zap,
  X
} from "lucide-react";
import { PulseLoader } from "react-spinners";

interface Destination {
  id: string;
  name: string;
  type: 'wildlife' | 'waterfall' | 'hill_station' | 'cultural' | 'pilgrimage';
  position: { top: string; left: string };
  coordinates: { lat: number; lng: number };
  description: string;
  highlights: string[];
  bestTime: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

const jharkhandDestinations: Destination[] = [
  {
    id: 'betla',
    name: 'Betla National Park',
    type: 'wildlife',
    position: { top: '25%', left: '30%' },
    coordinates: { lat: 23.8644, lng: 84.1912 },
    description: 'Premier tiger reserve with diverse wildlife and pristine forests',
    highlights: ['Royal Bengal Tigers', 'Elephant Safari', '200+ Bird Species'],
    bestTime: 'November to April',
    difficulty: 'moderate'
  },
  {
    id: 'hundru',
    name: 'Hundru Falls',
    type: 'waterfall',
    position: { top: '65%', left: '45%' },
    coordinates: { lat: 23.4231, lng: 85.5970 },
    description: '98-meter spectacular waterfall on Subarnarekha River',
    highlights: ['98m High Fall', 'Rock Climbing', 'Photography'],
    bestTime: 'July to October',
    difficulty: 'easy'
  },
  {
    id: 'netarhat',
    name: 'Netarhat Hills',
    type: 'hill_station',
    position: { top: '40%', left: '20%' },
    coordinates: { lat: 23.4672, lng: 84.2569 },
    description: 'Queen of Chotanagpur with mesmerizing sunrise views',
    highlights: ['Sunrise Point', 'Cool Climate', 'Forest Trails'],
    bestTime: 'October to March',
    difficulty: 'easy'
  },
  {
    id: 'tribal-village',
    name: 'Santhal Tribal Village',
    type: 'cultural',
    position: { top: '55%', left: '65%' },
    coordinates: { lat: 24.2644, lng: 87.1912 },
    description: 'Authentic tribal culture and traditional lifestyle',
    highlights: ['Traditional Dance', 'Handicrafts', 'Organic Farming'],
    bestTime: 'November to February',
    difficulty: 'easy'
  },
  {
    id: 'parasnath',
    name: 'Parasnath Hills',
    type: 'pilgrimage',
    position: { top: '35%', left: '70%' },
    coordinates: { lat: 23.9647, lng: 86.1626 },
    description: 'Highest peak and sacred Jain pilgrimage site',
    highlights: ['24 Jain Temples', 'Trekking', 'Spiritual Retreat'],
    bestTime: 'October to March',
    difficulty: 'challenging'
  }
];

const typeConfig = {
  wildlife: { icon: TreePine, color: 'bg-green-500', label: 'Wildlife' },
  waterfall: { icon: Waves, color: 'bg-blue-500', label: 'Waterfall' },
  hill_station: { icon: Mountain, color: 'bg-purple-500', label: 'Hill Station' },
  cultural: { icon: Users, color: 'bg-orange-500', label: 'Cultural' },
  pilgrimage: { icon: Camera, color: 'bg-red-500', label: 'Pilgrimage' }
};

export default function InteractiveMap() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const router = useRouter();

  const handleDestinationClick = useCallback((destination: Destination) => {
    setSelectedDestination(destination);
  }, []);

  
    const [isLoading, setIsLoading] = useState(false);
  
    function handlePlanVisit(): void {
      setIsLoading(true);
      router.push("/create-new-trip");
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black/40">
          <PulseLoader color="orange" size={15} />
          <p className="text-white mt-4">Loading...</p>
        </div>
      );
    }

  const filteredDestinations = jharkhandDestinations.filter(dest => 
    activeFilter === 'all' || dest.type === activeFilter
  );

  return (
    <div className="relative bg-black">
      <h1 className="text-4xl font-bold text-white p-4">Special Places</h1>
      {/* Map Container */}
      <div className="relative h-[600px] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden">
        {/* Jharkhand State Outline */}
        <div className="absolute inset-0 opacity-30">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 400 300" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M50 100 Q80 80 120 90 L180 85 Q220 75 260 95 L320 110 Q350 130 340 170 L335 210 Q320 240 280 250 L200 255 Q150 250 120 230 L80 200 Q50 170 55 140 Z" 
              fill="currentColor" 
              className="text-primary/40"
            />
          </svg>
        </div>

        {/* Interactive Destination Markers */}
        {filteredDestinations.map((destination) => {
          const config = typeConfig[destination.type];
          const IconComponent = config.icon;
          
          return (
            <motion.div
              key={destination.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.2 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              style={{ 
                top: destination.position.top, 
                left: destination.position.left 
              }}
              onClick={() => handleDestinationClick(destination)}
            >
              {/* Pulse Animation */}
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
              
              {/* Main Marker */}
              <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-gray-800">
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              
              {/* Hover Tooltip */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                <div className="text-sm font-semibold text-white">{destination.name}</div>
                <div className="text-xs text-gray-400">{typeConfig[destination.type].label}</div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 border-r border-b border-gray-700 rotate-45" />
              </div>
            </motion.div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
          <button className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Navigation className="w-5 h-5 text-gray-300" />
          </button>
          <button className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Zap className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800/95 border border-gray-700 backdrop-blur-sm rounded-xl p-4 shadow-lg z-30">
          <div className="text-sm font-semibold mb-3 text-white">Destination Types</div>
          <div className="space-y-2">
            {Object.entries(typeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${config.color} rounded-full`} />
                <span className="text-xs text-gray-300">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Detail Modal - Absolute positioned */}
        {selectedDestination && (
          <>
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedDestination(null)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    {React.createElement(typeConfig[selectedDestination.type].icon, { 
                      className: "w-6 h-6 text-white" 
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedDestination.name}</h3>
                    <p className="text-sm text-gray-400">{typeConfig[selectedDestination.type].label}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              <p className="text-gray-300 mb-6">{selectedDestination.description}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.highlights.map((highlight, index) => (
                      <span 
                        key={index}
                        className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Best Time</h4>
                    <p className="text-sm text-gray-400">{selectedDestination.bestTime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Difficulty</h4>
                    <p className={`text-sm font-medium capitalize ${
                      selectedDestination.difficulty === 'easy' ? 'text-green-400' :
                      selectedDestination.difficulty === 'moderate' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {selectedDestination.difficulty}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={handlePlanVisit}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Plan Visit
                  </button>
                  <button className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold transition-colors">
                    More Info
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Filter Controls */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Destinations
        </button>
        {Object.entries(typeConfig).map(([type, config]) => {
          const IconComponent = config.icon;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === type 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <IconComponent size={16} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}