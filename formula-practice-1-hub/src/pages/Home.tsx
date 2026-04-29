/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Trophy, Calendar as CalendarIcon, Zap, Users, Shield, ArrowRight, Flag, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDb } from '../lib/storage';
import { useMemo } from 'react';

export default function Home() {
  const db = getDb();

  const activeSeason = useMemo(() => db.seasons.find(s => s.isActive) || db.seasons[0], [db]);

  const lastRace = useMemo(() => {
    const completedRaces = db.races
      .filter(r => r.status === 'completed' && r.seasonId === activeSeason?.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return completedRaces[0];
  }, [db, activeSeason]);

  const nextRace = useMemo(() => {
    const upcomingRaces = db.races
      .filter(r => r.status === 'upcoming' && r.seasonId === activeSeason?.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcomingRaces[0];
  }, [db, activeSeason]);

  const winner = useMemo(() => {
    if (!lastRace || !lastRace.results.length) return null;
    const firstPlace = lastRace.results.find(r => r.position === 1);
    if (!firstPlace) return null;
    return db.drivers.find(d => d.id === firstPlace.driverId);
  }, [lastRace, db]);

  // Simple standings calc for home
  const standings = useMemo(() => {
    const scores: Record<string, number> = {};
    db.races
      .filter(r => r.seasonId === activeSeason?.id && r.status === 'completed')
      .forEach(r => {
        r.results.forEach(res => {
          scores[res.driverId] = (scores[res.driverId] || 0) + res.points;
        });
      });
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([id, pts]) => ({
        driver: db.drivers.find(d => d.id === id),
        points: pts
      }));
  }, [db, activeSeason]);

  const leader = standings[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Hero Section - Geometric Style */}
      <section className="accent-card relative h-[400px] flex items-center px-12 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=2000&auto=format&fit=crop"
            alt="Racing background"
            className="w-full h-full object-cover opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-racing-black via-racing-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-racing-red font-display font-black uppercase text-xs tracking-[0.3em] mb-4"
          >
            NEXT EVENT
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] mb-8 uppercase"
          >
            {nextRace?.name || "The Grid"} <br /> <span className="text-white">{nextRace?.date || "Awaits"}</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Link to="/calendar" className="btn-primary">
              <span>Race Details</span>
            </Link>
            <Link to="/seasons" className="btn-outline">
              <span>Season Archive</span>
            </Link>
          </motion.div>
        </div>

        {/* Geometric Timer Element */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end">
           <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-[0.2em]">{lastRace?.name} Result</div>
           <div className="flex gap-2">
              <div className="bg-racing-black p-4 border border-racing-border">
                <div className="text-4xl font-mono font-black italic">{winner?.name.split(' ')[1].slice(0, 3)}</div>
                <div className="text-[8px] uppercase tracking-widest text-center mt-1">Winner</div>
              </div>
           </div>
        </div>
      </section>

      {/* Stats Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Season Leader"
          value={leader?.driver?.name || 'N/A'}
          subtitle={`${leader?.points || 0} Points`}
          icon={Trophy}
          link={`/drivers/${leader?.driver?.id}`}
          color="text-yellow-500"
        />
        <OverviewCard
          title="Latest Winner"
          value={winner?.name || 'N/A'}
          subtitle={lastRace?.name || '-'}
          icon={Flag}
          link={`/races/${lastRace?.id}`}
          color="text-racing-red"
        />
        <OverviewCard
          title="Active Season"
          value={activeSeason?.year.toString() || 'None'}
          subtitle={`${activeSeason?.drivers.length || 0} Drivers`}
          icon={Users}
          link={`/seasons/${activeSeason?.id}`}
          color="text-blue-500"
        />
        <OverviewCard
          title="Next Race"
          value={nextRace?.name?.split(' ')[0] || 'TBD'}
          subtitle={nextRace?.date || '-'}
          icon={CalendarIcon}
          link={nextRace ? `/calendar` : '/'}
          color="text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-racing-card border border-racing-border rounded-sm flex flex-col">
            <div className="p-4 border-b border-racing-border flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2">
                <Shield className="w-4 h-4 text-racing-red" />
                <span>Recent Updates</span>
              </h2>
              <Link to="/news" className="text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors">
                Database Log &rarr;
              </Link>
            </div>
            <div className="divide-y divide-racing-border">
              {db.news.slice(0, 3).map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-white/5 transition-all group">
                  <div className="bg-racing-black p-3 border border-racing-border text-racing-red font-black text-sm italic">
                    {item.type.slice(0, 4).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{item.date}</div>
                    <h3 className="text-lg font-bold uppercase group-hover:text-racing-red transition-colors">{item.title}</h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </section>

          <section>
             <div className="px-1 text-[10px] uppercase font-bold text-gray-500 tracking-[0.3em] mb-4">Quick Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <NavTile to="/seasons" label="Archives" icon={Trophy} />
              <NavTile to="/calendar" label="Calendar" icon={CalendarIcon} />
              <NavTile to="/drivers" label="Drivers" icon={Users} />
              <NavTile to="/teams" label="Teams" icon={Shield} />
              <NavTile to="/stats" label="Database" icon={BarChart3} />
              <NavTile to="/admin" label="Manage" icon={Shield} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="glass-card">
            <div className="p-4 bg-racing-border/30 border-b border-racing-border">
              <h3 className="flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.2em]">
                <Trophy className="w-4 h-4 text-racing-red" />
                <span>Driver Standings</span>
              </h3>
            </div>
            <div className="divide-y divide-racing-border">
              {standings.slice(0, 5).map((entry, idx) => (
                <Link
                  key={entry.driver?.id}
                  to={`/drivers/${entry.driver?.id}`}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-sm font-bold w-4 text-gray-500">{idx + 1}</span>
                    <div>
                      <div className="font-black italic text-sm uppercase">{entry.driver?.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{entry.driver?.nationality}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-xl">{entry.points}</div>
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-racing-border text-center bg-[#242428]/30">
              <Link to="/seasons" className="text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-colors">
                View Full Championship Table
              </Link>
            </div>
          </section>

          <section className="accent-card flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-racing-card/80">
            <Shield className="w-12 h-12 text-racing-red mb-4" />
            <h3 className="text-2xl font-black italic uppercase leading-none">JOIN THE NETWORK</h3>
            <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest italic">Submit New Race Data</p>
            <Link to="/admin" className="mt-6 w-full text-center py-2 bg-racing-black border border-racing-border hover:bg-racing-red hover:border-racing-red transition-all text-[10px] font-bold uppercase tracking-widest">
              Access Admin Console
            </Link>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}

function OverviewCard({ title, value, subtitle, icon: Icon, link }: any) {
  return (
    <Link to={link} className="glass-card p-6 flex flex-col justify-between hover:border-racing-red/50 transition-all group group relative">
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
         <div className="absolute top-0 right-0 w-8 h-[1px] bg-racing-border group-hover:bg-racing-red transition-colors" />
         <div className="absolute top-0 right-0 w-[1px] h-8 bg-racing-border group-hover:bg-racing-red transition-colors" />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="bg-racing-black p-3 border border-racing-border">
          <Icon className="w-5 h-5 text-racing-red" />
        </div>
        <ArrowRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
      <div>
        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">{title}</div>
        <div className="text-xl font-display font-black italic tracking-tighter truncate uppercase group-hover:text-racing-red transition-colors">{value}</div>
        <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{subtitle}</div>
      </div>
    </Link>
  );
}

function NavTile({ to, label, icon: Icon }: any) {
  return (
    <Link to={to} className="bg-racing-dark border border-racing-border p-4 flex flex-col items-center justify-center space-y-2 hover:bg-racing-red hover:border-racing-red transition-all group text-center rounded-sm">
      <Icon className="w-5 h-5 text-racing-red group-hover:text-white transition-colors" />
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">{label}</span>
    </Link>
  );
}
