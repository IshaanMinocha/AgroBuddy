import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-emerald-100">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src="/logo.png" alt="AgroBuddy Logo" className="h-12 w-12" />
            <p className="text-sm text-emerald-200">
              Empowering farmers with smart technology for better yields and sustainable farming practices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <HiMail className="text-emerald-400" />
                <a href="mailto:info@agrobuddy.com" className="hover:text-white transition-colors">
                  info@agrobuddy.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <HiPhone className="text-emerald-400" />
                <span>+91 123 456 7890</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-emerald-300">
              © 2025 AgroBuddy.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-emerald-400 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-emerald-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-emerald-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;