import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Brain, Languages, BarChart, Leaf, CloudSun, Store, Bot } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Plant Disease Detection",
      description: "Scan plants with your phone camera to instantly identify diseases, nutrient deficiencies, and get treatment solutions"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Crop Management",
      description: "AI-powered recommendations for optimal farming practices based on soil health, weather, and crop conditions"
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Local Language Support",
      description: "Get farming advice and support in your preferred local language through our AI talkbot"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Yield Prediction",
      description: "Accurate harvest predictions using AI analysis of environmental factors and historical data"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Soil Health Monitoring",
      description: "Real-time tracking of soil nutrients, moisture, and health using IoT sensors"
    },
    {
      icon: <CloudSun className="w-8 h-8" />,
      title: "Weather Insights",
      description: "Get localized weather updates and alerts to plan your farming activities better"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Smart Marketplace",
      description: "AI-driven price predictions and direct connection with buyers for better profits"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "24/7 AI Support",
      description: "Round-the-clock assistance for all your farming queries through our intelligent chatbot"
    }
  ];

  return (
    <section className="py-4 md:py-16 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-2 md:px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-4xl font-bold text-center text-emerald-900 mb-4 md:mb-12"
        >
          Smart Farming Features
        </motion.h2>
        <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 hide-scrollbar">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="flex-none w-[200px] md:w-auto snap-center p-3 md:p-5 rounded-md md:rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="text-emerald-600 bg-emerald-50 p-2 md:p-3 rounded-md mb-2 md:mb-4 group-hover:bg-emerald-100 transition-colors"
                  whileHover={{ rotate: 5 }}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8">
                    {feature.icon}
                  </div>
                </motion.div>
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-emerald-900">{feature.title}</h3>
                <p className="text-xs md:text-sm text-emerald-600 leading-tight md:leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;