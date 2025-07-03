import React from "react";
import Logo from "@/assets/Logo.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#1a1a40] via-[#2d1e60] to-[#ff0080] text-white py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo & About */}
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <img src={Logo} alt="ThreatLens Logo" className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">ThreatLens</h2>
            <p className="text-sm text-white/80 max-w-xs">Empowering Cybersecurity Awareness. Learn, Defend, and Stay Secure with Professional Training.</p>
          </div>
        </div>
        {/* Links */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link to="/home" className="hover:text-[#ff0080] transition-colors">Home</Link>
          <Link to="/course/search" className="hover:text-[#ff0080] transition-colors">Courses</Link>
          <Link to="/" className="hover:text-[#ff0080] transition-colors">About</Link>
          <a href="#" className="hover:text-[#ff0080] transition-colors">Contact</a>
          <a href="#" className="hover:text-[#ff0080] transition-colors">Privacy</a>
        </div>
        {/* Social Icons */}
        <div className="flex gap-4 items-center">
          <a href="#" aria-label="LinkedIn" className="hover:text-[#ff0080] transition-colors">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-[#ff0080] transition-colors">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/></svg>
          </a>
          <a href="#" aria-label="GitHub" className="hover:text-[#ff0080] transition-colors">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-white/70 text-sm">
        &copy; {new Date().getFullYear()} ThreatLens. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 