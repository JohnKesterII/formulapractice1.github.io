/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { Trophy, Calendar, Users, Shield, BarChart3, Settings, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Seasons', path: '/seasons', icon: Trophy },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Teams', path: '/teams', icon: Shield },
  { name: 'Stats', path: '/stats', icon: BarChart3 },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-racing-black border-b border-racing-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-racing-red p-1 rounded-sm w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-3">
              <span className="font-display font-black text-xl italic tracking-tighter text-white block">FP1</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xs tracking-[0.2em] uppercase leading-none">Championship</span>
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Database System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                    isActive ? "text-racing-red border-b-2 border-racing-red" : "text-gray-500 hover:text-white"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
             <div className="h-4 w-[1px] bg-racing-border mx-4"></div>
             <div className="flex items-center space-x-2 px-3 py-1 bg-racing-dark border border-racing-border rounded-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[9px] font-bold uppercase text-gray-400">Live</span>
             </div>
            <Link
              to="/admin"
              className="ml-4 p-2 text-gray-500 hover:text-white transition-colors"
              title="Admin Panel"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-racing-dark border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-4 text-base font-display font-bold uppercase border-b border-white/5 last:border-0"
                >
                  <item.icon className="w-5 h-5 text-racing-red" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-4 text-base font-display font-bold uppercase text-racing-silver"
              >
                <Settings className="w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
