/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { BarChart3, Trophy, Target, Flag, Clock, Users, Shield } from 'lucide-react';
import { getDb } from '../lib/storage';
import { useMemo } from 'react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Stats() {
  const db = getDb();

  const allTimeStats = useMemo(() => {
    const winners: Record<string, number> = {};
    const podiasts: Record<string, number> = {};
    const poles: Record<string, number> = {};
    const points: Record<string, number> = {};
    const constructorChampions: Record<string, number> = {};
    const driverChampions: Record<string, number> = {};

    db.seasons.forEach(s => {
      if (s.championDriverId) driverChampions[s.championDriverId] = (driverChampions[s.championDriverId] || 0) + 1;
      if (s.championConstructorId) constructorChampions[s.championConstructorId] = (constructorChampions[s.championConstructorId] || 0) + 1;
    });

    db.races.filter(r => r.status === 'completed').forEach(r => {
      if (r.poleSitterId) poles[r.poleSitterId] = (poles[r.poleSitterId] || 0) + 1;
      r.results.forEach(res => {
        points[res.driverId] = (points[res.driverId] || 0) + res.points;
        if (res.position === 1) winners[res.driverId] = (winners[res.driverId] || 0) + 1;
        if (res.position <= 3) podiasts[res.driverId] = (podiasts[res.driverId] || 0) + 1;
      });
    });

    const sortMap = (map: Record<string, number>) => 
      Object.entries(map).sort(([, a], [, b]) => b - a).map(([id, val]) => ({ id, val }));

    return {
      mostWins: sortMap(winners).slice(0, 5),
      mostPodiums: sortMap(podiasts).slice(0, 5),
      mostPoles: sortMap(poles).slice(0, 5),
      mostPoints: sortMap(points).slice(0, 5),
      mostDriverTitles: sortMap(driverChampions).slice(0, 5),
      mostConstructorTitles: sortMap(constructorChampions).slice(0, 5),
    };
  }, [db]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl font-extrabold italic tracking-tighter">STATISTICS HUB</h1>
        <p className="text-racing-silver uppercase text-sm font-bold tracking-widest">History Written in Data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <StatsSection title="All-Time Wins" icon={Flag} stats={allTimeStats.mostWins} db={db} type="drivers" />
         <StatsSection title="All-Time Podiums" icon={Trophy} stats={allTimeStats.mostPodiums} db={db} type="drivers" />
         <StatsSection title="All-Time Poles" icon={Target} stats={allTimeStats.mostPoles} db={db} type="drivers" />
         <StatsSection title="Driver Titles" icon={Zap} stats={allTimeStats.mostDriverTitles} db={db} type="drivers" />
         <StatsSection title="Constructor Titles" icon={Shield} stats={allTimeStats.mostConstructorTitles} db={db} type="teams" />
         <StatsSection title="Career Points" icon={BarChart3} stats={allTimeStats.mostPoints} db={db} type="drivers" />
      </div>

      <section className="glass-card p-12 text-center bg-white/5 border-white/5">
        <Clock className="w-12 h-12 text-racing-silver/20 mx-auto mb-4" />
        <h2 className="text-3xl font-black italic mb-4 uppercase">More Analytics Coming Soon</h2>
        <p className="text-racing-silver max-w-xl mx-auto uppercase text-xs font-bold tracking-widest leading-loose">
          Rivalry tracker • Team head-to-head • Interactive points calculator • Multi-season form analysis
        </p>
      </section>
    </motion.div>
  );
}

function StatsSection({ title, icon: Icon, stats, db, type }: any) {
  return (
    <div className="glass-card">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center space-x-2">
        <Icon className="w-5 h-5 text-racing-red" />
        <h3 className="font-bold uppercase tracking-tight text-sm">{title}</h3>
      </div>
      <div className="p-4 space-y-4">
        {stats.length > 0 ? stats.map((s: any, idx: number) => {
          const entity = type === 'drivers' 
            ? db.drivers.find((d: any) => d.id === s.id) 
            : db.teams.find((t: any) => t.id === s.id);
          
          return (
            <Link key={s.id} to={`/${type}/${s.id}`} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                 <span className="font-mono text-[10px] text-racing-silver w-4">{idx + 1}</span>
                 <div className="font-bold text-sm group-hover:text-racing-red transition-colors">{entity?.name || 'Unknown'}</div>
              </div>
              <div className="font-mono font-bold text-lg">{s.val}</div>
            </Link>
          );
        }) : (
           <div className="py-4 text-center text-xs text-racing-silver italic">No data yet</div>
        )}
      </div>
    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
