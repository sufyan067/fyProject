import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };
  return (
    <div className="relative bg-gradient-to-br from-blue-800 via-purple-800 to-pink-700 dark:from-gray-900 dark:via-gray-800 dark:to-pink-900 py-24 px-4 text-center overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 tracking-tight animate-glow">
          Unlock Your Cyber Potential
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8 text-lg md:text-xl animate-fade-in">
          Explore, learn, and upskill with ThreatLens—your gateway to cybersecurity mastery.
        </p>
        <form onSubmit={searchHandler} className="flex items-center bg-white/90 dark:bg-gray-800/90 rounded-full shadow-xl overflow-hidden max-w-xl mx-auto mb-6 border-2 border-pink-400/30 focus-within:border-pink-500 transition-all animate-fade-in-up">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
          />
          <Button type="submit" className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white px-6 py-3 rounded-r-full hover:from-pink-600 hover:to-blue-700 transition-all font-bold shadow-md">
            Search
          </Button>
        </form>
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-full px-8 py-3 font-bold shadow-lg hover:from-blue-700 hover:to-pink-600 transition-all animate-bounce"
        >
          Explore Courses
        </Button>
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
          50% { transform: translateY(-14px); }
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
        .animate-bounce {
          animation: bounce 1.5s infinite alternate;
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;