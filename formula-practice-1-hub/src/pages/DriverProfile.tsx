/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getDb } from '../lib/storage';
import { Trophy, Flag, Star, Target, Shield, ArrowLeft, BarChart2 } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '../lib/utils';

export default function DriverProfile() {
  const { id } = useParams();
  const db = getDb();
  const driver = db.drivers.find(d => d.id === id);

  const stats = useMemo(() => {
    if (!driver) return null;
    const races = db.races.filter(r => r.status === 'completed');
    const participations = races.flatMap(r => r.results.filter(res => res.driverId === driver.id));
    
    const wins = participations.filter(p => p.position === 1).length;
    const podiums = participations.filter(p => p.position <= 3).length;
    const poles = races.filter(r => r.poleSitterId === driver.id).length;
    const careerPoints = participations.reduce((sum, p) => sum + p.points, 0);

    return { wins, podiums, poles, careerPoints, entries: participations.length };
  }, [id, db]);

  if (!driver) return <div className="text-center py-20">Driver not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Link to="/drivers" className="inline-flex items-center space-x-2 text-sm font-bold uppercase text-racing-silver hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>All Drivers</span>
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Imagery */}
        <div className="space-y-6">
          {(() => {
            const currentSeason = db.seasons.find(s => s.year === 2026);
            const firstResult = db.races
              .find(r => r.seasonId === currentSeason?.id && r.status === 'completed' && r.results.some(res => res.driverId === driver.id))
              ?.results.find(res => res.driverId === driver.id);
            
            const team = firstResult 
              ? db.teams.find(t => t.id === firstResult.teamId)
              : db.teams.find(t => t.id === 'mclaren'); // Fallback

            return (
              <div className="glass-card relative aspect-[3/4] overflow-hidden group border-white/10" style={{ backgroundColor: team?.primaryColor + '20' }}>
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: team?.primaryColor }} />
                <img 
                   src={`https://picsum.photos/seed/${driver.id}/800/1200`} 
                   alt={driver.name} 
                   className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                   referrerPolicy="no-referrer"
                />
                <div className="absolute top-0 right-0 p-6 z-20">
                  <span className="text-8xl font-black italic text-white/5 group-hover:text-white/10 transition-colors uppercase leading-none">{driver.number}</span>
                </div>
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-racing-black via-racing-black/80 to-transparent w-full z-20">
                   <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">{driver.name}</h1>
                   <div className="flex items-center space-x-4">
                      <div className="px-3 py-1 bg-racing-red text-[10px] font-bold uppercase tracking-widest">{driver.nationality}</div>
                      <div className="text-sm font-bold uppercase text-racing-silver">Age: {driver.age}</div>
                   </div>
                </div>
              </div>
            );
          })()}

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center space-x-2">
              <Star className="w-5 h-5 text-racing-red" />
              <span>Attributes</span>
            </h3>
            <div className="space-y-4">
              <StatBar label="Pace" value={driver.stats?.pace || 0} />
              <StatBar label="Racecraft" value={driver.stats?.racecraft || 0} />
              <StatBar label="Experience" value={driver.stats?.experience || 0} />
              <StatBar label="Awareness" value={driver.stats?.awareness || 0} />
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Career */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <CareerStat label="Wins" value={stats?.wins || 0} icon={Trophy} />
             <CareerStat label="Podiums" value={stats?.podiums || 0} icon={Flag} />
             <CareerStat label="Poles" value={stats?.poles || 0} icon={Target} />
             <CareerStat label="Points" value={stats?.careerPoints || 0} icon={BarChart2} />
          </div>

          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 pb-4 border-b border-white/10">Biography</h3>
            <p className="text-racing-silver leading-relaxed whitespace-pre-wrap">{driver.biography}</p>
          </div>

          <div className="glass-card">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h3 className="font-bold uppercase tracking-tight">Recent Results</h3>
            </div>
            <table className="racing-table">
              <thead>
                <tr>
                  <th>Race</th>
                  <th>Grid</th>
                  <th>Pos</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {db.races.filter(r => r.status === 'completed').map(r => {
                  const result = r.results.find(res => res.driverId === driver.id);
                  if (!result) return null;
                  return (
                    <tr key={r.id}>
                      <td className="font-bold">{r.name}</td>
                      <td className="font-mono text-xs">{result.grid}</td>
                      <td>
                        <span className={cn(
                          "px-2 py-0.5 rounded font-bold text-xs uppercase",
                          result.position === 1 ? "bg-yellow-500 text-black" : 
                          result.position <= 3 ? "bg-racing-silver text-black" : "bg-white/10"
                        )}>
                          P{result.position}
                        </span>
                      </td>
                      <td className="font-mono font-bold">+{result.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function StatBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-racing-silver">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${value}%` }}
           transition={{ duration: 1, ease: 'easeOut' }}
           className="h-full bg-racing-red" 
        />
      </div>
    </div>
  );
}

function CareerStat({ label, value, icon: Icon }: any) {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-2 border-white/5">
      <Icon className="w-5 h-5 text-racing-red opacity-50" />
      <div className="text-3xl font-black italic tracking-tighter uppercase">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-racing-silver">{label}</div>
    </div>
  );
}
