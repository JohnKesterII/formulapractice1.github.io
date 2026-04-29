/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getDb } from '../lib/storage';
import { Trophy, Flag, MapPin, Calendar, Clock, ArrowLeft, Zap, Info } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '../lib/utils';

export default function RaceDetail() {
  const { id } = useParams();
  const db = getDb();
  const race = db.races.find(r => r.id === id);
  const circuit = db.circuits.find(c => c?.id === race?.circuitId);

  const podium = useMemo(() => {
    if (!race) return [];
    return race.results
      .filter(r => r.position <= 3)
      .sort((a, b) => a.position - b.position)
      .map(r => ({
        ...r,
        driver: db.drivers.find(d => d.id === r.driverId),
        team: db.teams.find(t => t.id === r.teamId)
      }));
  }, [race, db]);

  if (!race) return <div className="text-center py-20 text-4xl font-black italic uppercase">Race Event Not Found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Link to="/calendar" className="inline-flex items-center space-x-2 text-xs font-bold uppercase text-racing-silver hover:text-white transition-colors">
        <ArrowLeft className="w-3 h-3" />
        <span>Full Calendar</span>
      </Link>

      {/* Header Info */}
      <header className="relative py-12 px-8 rounded-3xl overflow-hidden glass-card">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img 
               src={`https://picsum.photos/seed/${circuit?.id}/1200/400`} 
               className="w-full h-full object-cover grayscale" 
               alt="Circuit background"
               referrerPolicy="no-referrer"
            />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-racing-red text-[10px] font-bold uppercase tracking-widest italic leading-none">Round {race.round}</span>
                  <span className="text-xs font-bold uppercase text-racing-silver">{race.date}</span>
               </div>
               <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">{race.name}</h1>
               <div className="flex items-center space-x-6 text-sm font-bold uppercase text-racing-silver">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {circuit?.name}</div>
                  <div className="flex items-center"><Flag className="w-4 h-4 mr-2" /> {circuit?.country}</div>
               </div>
            </div>
            
            {podium.length > 0 && (
               <div className="flex space-x-4">
                  {podium.map((p, idx) => (
                    <div key={p.driverId} className={cn(
                      "p-4 rounded-xl border flex flex-col items-center justify-center text-center w-24 md:w-32",
                      idx === 0 ? "border-yellow-500 bg-yellow-500/10" : "border-white/10 bg-white/5"
                    )}>
                       <div className="text-[10px] font-bold uppercase text-racing-silver mb-1 italic">P{p.position}</div>
                       <div className="font-bold text-sm truncate w-full">{p.driver?.name}</div>
                       <Trophy className={cn("w-4 h-4 mt-2", idx === 0 ? "text-yellow-500" : "text-racing-silver")} />
                    </div>
                  ))}
               </div>
            )}
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results Table */}
        <div className="lg:col-span-2 space-y-6">
           <section className="glass-card">
              <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                 <h2 className="font-bold uppercase tracking-tight flex items-center">
                    <Flag className="w-5 h-5 mr-2 text-racing-red" />
                    <span>Race Results</span>
                 </h2>
                 <div className="text-[10px] font-bold uppercase text-racing-silver">Status: {race.status}</div>
              </div>
              <table className="racing-table">
                <thead>
                  <tr>
                    <th className="w-12">Pos</th>
                    <th>Driver</th>
                    <th>Team</th>
                    <th className="hidden sm:table-cell">Grid</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {race.results.sort((a, b) => a.position - b.position).map((res) => {
                    const driver = db.drivers.find(d => d.id === res.driverId);
                    const team = db.teams.find(t => t.id === res.teamId);
                    return (
                      <tr key={res.driverId} className={cn(res.dnf && "opacity-40 grayscale")}>
                         <td className="font-mono font-bold text-lg">
                           {res.dnf ? 'DNF' : `P${res.position}`}
                         </td>
                         <td>
                           <Link to={`/drivers/${driver?.id}`} className="font-bold uppercase hover:text-racing-red transition-colors">{driver?.name}</Link>
                         </td>
                         <td>
                           <Link to={`/teams/${team?.id}`} className="flex items-center space-x-2 group">
                             <div className="w-1 h-4" style={{ backgroundColor: team?.primaryColor }} />
                             <span className="text-xs font-bold uppercase text-racing-silver group-hover:text-white transition-colors">{team?.name}</span>
                           </Link>
                         </td>
                         <td className="hidden sm:table-cell font-mono text-xs italic">{res.grid}</td>
                         <td className="font-mono font-bold">
                            {res.points > 0 && `+${res.points}`}
                            {res.fastestLap && <Zap className="w-3 h-3 inline ml-1 text-purple-400" title="Fastest Lap" />}
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {race.results.length === 0 && (
                <div className="p-12 text-center text-racing-silver italic uppercase font-bold tracking-widest">
                   Event has not yet taken place or results haven't been entered.
                </div>
              )}
           </section>
        </div>

        {/* Info & Stats */}
        <div className="space-y-6">
           <section className="glass-card p-6 space-y-4">
              <h3 className="font-bold uppercase tracking-tight flex items-center border-b border-white/10 pb-4">
                 <Info className="w-5 h-5 mr-2 text-racing-red" />
                 <span>Race Intel</span>
              </h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-bold text-racing-silver uppercase">Type</span>
                    <span className="font-bold uppercase italic text-sm">{race.type}</span>
                 </div>
                 <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-bold text-racing-silver uppercase">Pole Position</span>
                    <span className="font-bold uppercase text-sm">{db.drivers.find(d => d.id === race.poleSitterId)?.name || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-[10px] font-bold text-racing-silver uppercase">Fastest Lap</span>
                    <span className="font-bold uppercase text-sm">
                       {db.drivers.find(d => d.id === race.results.find(res => res.fastestLap)?.driverId)?.name || 'N/A'}
                    </span>
                 </div>
              </div>
           </section>

           {race.summary && (
              <section className="glass-card p-6">
                 <h3 className="font-bold uppercase tracking-tight mb-4 text-racing-red text-xs">Analysis</h3>
                 <p className="text-racing-silver text-sm italic leading-relaxed">"{race.summary}"</p>
              </section>
           )}

           <section className="glass-card p-6 bg-racing-red text-white flex flex-col items-center justify-center text-center space-y-4">
              <Clock className="w-12 h-12 opacity-50" />
              <div>
                <h4 className="text-xl font-bold uppercase tracking-tighter italic leading-none">NEXT STOP</h4>
                <p className="text-xs font-bold opacity-80 uppercase mt-1">Miami, United States</p>
              </div>
              <Link to="/calendar" className="w-full py-2 border border-white/50 bg-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                 View Schedule
              </Link>
           </section>
        </div>
      </div>
    </motion.div>
  );
}
