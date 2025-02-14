import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Screenshots = () => {
  const screenshots = [
    {
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000",
      title: "Crop Health Scanner",
      description: "Instantly detect plant diseases with your phone camera"
    },
    {
      url: "https://images.unsplash.com/photo-1592982537447-6c24a3bddafd?q=80&w=1000",
      title: "Yield Prediction",
      description: "Get accurate harvest predictions using AI"
    },
    {
      url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000",
      title: "Crop Recommendations",
      description: "Receive personalized crop suggestions for your land"
    },
    {
      url: "https://images.unsplash.com/photo-1595870866627-3c498c5722ba?q=80&w=1000",
      title: "Farming Guide",
      description: "Access expert farming techniques and tips"
    },
    {
      url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000",
      title: "Weather Alerts",
      description: "Get real-time weather updates for your farm"
    },
    {
      url: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1000",
      title: "Soil Analysis",
      description: "Understand your soil health better"
    },
    {
      url: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=1000",
      title: "Market Prices",
      description: "Stay updated with current crop prices"
    },
    {
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000",
      title: "Community Support",
      description: "Connect with other farmers"
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-gray-900 mb-10"
        >
          One App for All Your Farming Needs
        </motion.h2>

        <div className="relative">
          <div 
            ref={ref}
            className="flex gap-4 overflow-x-auto pb-6 px-4 -mx-4 scrollbar-hide"
          >
            {screenshots.map((screenshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex-none w-[240px] relative"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                  {/* Phone Frame */}
                  <div className="absolute inset-0 border-[8px] border-gray-800 rounded-2xl z-10"></div>
                  
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 flex items-center px-4">
                    <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                  
                  {/* Screenshot */}
                  <div className="aspect-[9/19]">
                    <img 
                      src={screenshot.url} 
                      alt={screenshot.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-lg font-semibold text-white mb-1">{screenshot.title}</h3>
                    <p className="text-sm text-gray-300">{screenshot.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Screenshots;