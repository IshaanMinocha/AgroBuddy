import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Screenshots from './components/Screenshots';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Screenshots />
      <Features />
      <Footer />
    </main>
  );
}

export default App;