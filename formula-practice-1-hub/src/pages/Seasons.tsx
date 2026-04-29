/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Trophy, Calendar, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDb } from '../lib/storage';

export default function Seasons() {
  const db = getDb();
  const sortedSeasons = [...db.seasons].sort((a, b) => b.year - a.year);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
       <header>
        <h1 className="text-4xl font-extrabold italic tracking-tighter">CHAMPIONSHIP ARCHIVE</h1>
        <p className="text-racing-silver uppercase text-sm font-bold tracking-widest">A legacy of fictional racing excellence</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSeasons.map((season) => {
          const championDriver = db.drivers.find(d => d.id === season.championDriverId);
          const championConstructor = db.teams.find(t => t.id === season.championConstructorId);
          
          return (
            <Link 
              key={season.id} 
              to={`/seasons/${season.id}`}
              className="group glass-card p-8 hover:border-racing-red/50 transition-all relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-6xl font-black italic text-white/5 group-hover:text-racing-red/10 transition-colors uppercase leading-none">
                    {season.year}
                  </div>
                  {season.isActive && (
                    <span className="px-2 py-1 bg-racing-red text-[10px] font-bold uppercase tracking-widest animate-pulse">Live</span>
                  )}
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{season.year} Campaign</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-racing-silver uppercase font-bold">Races</span>
                      <span className="font-mono">{season.races.length} Rounds</span>
                    </div>
                    {championDriver && (
                      <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                        <span className="text-racing-silver uppercase font-bold">Driver Champ</span>
                        <span className="font-bold text-racing-red">{championDriver.name}</span>
                      </div>
                    )}
                    {championConstructor && (
                      <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                        <span className="text-racing-silver uppercase font-bold">Constructor</span>
                        <span className="font-bold">{championConstructor.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-racing-silver uppercase tracking-widest group-hover:text-white transition-colors">Enter Archives</span>
                  <ArrowRight className="w-5 h-5 text-racing-red transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
                 <Trophy className="w-full h-full text-white" />
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
