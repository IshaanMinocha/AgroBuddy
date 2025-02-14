import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShare2 } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

function Hero() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  
  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement("a");
    link.href = "/AgroBuddy.apk";
    link.download = "AgroBuddy.apk";
    link.click();

    setTimeout(() => {
      setDownloadStarted(false);
    }, 3000);
  };

  return (
    <section className="pt-24 pb-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="AgroBuddy" className="w-32 h-32 rounded-2xl shadow-md" />
            </div>

            {/* App Info */}
            <div className="flex-grow">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    AgroBuddy
                    <span className="text-sm font-normal text-gray-500 ml-2">by Team Magnum Opus</span>
                  </h1>
                  <p className="text-sm text-gray-600">1.0.0 - For iOS & Android</p>

                  {/* Download Button & Share */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={handleDownload}
                      className="bg-green-500 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
                    >
                      <FiArrowRight className="w-5 h-5" />
                      <span>Download APK</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiShare2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* App Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Device Support</span>
                      <p className="text-gray-900">iOS & Android</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Update date</span>
                      <p className="text-gray-900">Feb 12, 2025</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Size</span>
                      <p className="text-gray-900">15 MB</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Trusted</span>
                      <p className="text-green-600">Verified App</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About AgroBuddy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              AgroBuddy is your complete farming companion that helps increase production, yield, and profits. 
              With features like crop health scanning, yield prediction, and personalized recommendations, 
              we make modern farming accessible to everyone.
            </p>
          </div>
        </div>

        {downloadStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg"
          >
            <p className="text-gray-800">Download Started...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;