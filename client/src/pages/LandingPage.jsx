import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-800 transition-colors duration-500 relative overflow-hidden">
      {/* Glowing background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 opacity-30 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="z-10 text-center animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight animate-glow">
          ThreatLens
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-pink-200 mb-6 animate-pulse">
          Defend. Empower. Transform.
        </h2>
        <p className="text-lg md:text-xl text-white/90 dark:text-gray-200 max-w-2xl mx-auto mb-8 font-medium animate-fade-in">
          Step into the future of cybersecurity awareness.<br/>
          ThreatLens delivers immersive, real-world training to empower you against digital threats.<br/>
          Build your cyber instincts. Stay secure. Lead the change.
        </p>
        <Button
          className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:from-pink-600 hover:to-blue-700 transition-all duration-300 border-2 border-white/20 backdrop-blur-md"
          onClick={() => navigate('/home')}
        >
          Skip
        </Button>
      </div>
      {/* Animated cyber shield SVG */}
      <div className="z-10 mt-12 animate-float">
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cyberGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#a21caf" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          <ellipse cx="55" cy="55" rx="50" ry="50" fill="url(#cyberGradient)" opacity="0.15" />
          <path d="M55 20 L85 35 V60 C85 80 55 95 55 95 C55 95 25 80 25 60 V35 Z" fill="#fff" fillOpacity="0.15" stroke="#a21caf" strokeWidth="3" />
          <path d="M55 35 V65" stroke="#a21caf" strokeWidth="3" strokeLinecap="round" />
          <circle cx="55" cy="50" r="6" fill="#a21caf" stroke="#fff" strokeWidth="2" />
        </svg>
      </div>
      {/* Animations */}
      <style>{`
        .animate-glow {
          text-shadow: 0 0 16px #f472b6, 0 0 32px #a21caf, 0 0 48px #2563eb;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 