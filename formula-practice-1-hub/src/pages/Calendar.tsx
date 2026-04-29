/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar as CalendarIcon, MapPin, Flag, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDb } from '../lib/storage';
import { useMemo } from 'react';
import { cn } from '../lib/utils';

export default function Calendar() {
  const db = getDb();
  const activeSeason = db.seasons.find(s => s.isActive) || db.seasons[0];
  
  const seasonRaces = useMemo(() => {
    return db.races
      .filter(r => r.seasonId === activeSeason?.id)
      .sort((a, b) => a.round - b.round);
  }, [db.races, activeSeason]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl font-extrabold italic tracking-tighter">{activeSeason?.year} CALENDAR</h1>
        <p className="text-racing-silver uppercase text-sm font-bold tracking-widest">Global Tour of Speed</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {seasonRaces.map((race) => {
          const circuit = db.circuits.find(c => c.id === race.circuitId);
          const winnerResult = race.results.find(res => res.position === 1);
          const winnerDriver = winnerResult ? db.drivers.find(d => d.id === winnerResult.driverId) : null;
          const isCompleted = race.status === 'completed';

          return (
            <div key={race.id} className={cn(
              "glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative group",
              isCompleted && "bg-white/5 grayscale hover:grayscale-0 transition-all duration-500"
            )}>
              <div className="flex items-center space-x-6 w-full md:w-auto">
                <div className="text-4xl font-black italic text-white/10 w-12 text-center">{race.round}</div>
                <div className="space-y-1">
                   <div className="text-[10px] font-bold text-racing-red uppercase tracking-widest">{race.date}</div>
                   <h3 className="text-2xl font-bold uppercase tracking-tight group-hover:text-racing-red transition-colors">{race.name}</h3>
                   <div className="flex items-center text-racing-silver text-xs font-bold uppercase transition-colors">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{circuit?.name}, {circuit?.country}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end">
                {isCompleted ? (
                   <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-bold text-racing-silver uppercase tracking-widest">Winner</div>
                        <div className="font-bold text-white uppercase">{winnerDriver?.name}</div>
                      </div>
                      <Link to={`/races/${race.id}`} className="btn-outline">
                         <span>Results</span>
                      </Link>
                   </div>
                ) : (
                  <div className="flex items-center space-x-4">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-racing-red px-2 py-1 border border-racing-red">Upcoming</span>
                     <button className="btn-outline opacity-50 cursor-not-allowed">
                        <span>Details Soon</span>
                     </button>
                  </div>
                )}
              </div>

              {isCompleted && (
                <div className="absolute top-2 right-2">
                   <Trophy className="w-4 h-4 text-yellow-500/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
