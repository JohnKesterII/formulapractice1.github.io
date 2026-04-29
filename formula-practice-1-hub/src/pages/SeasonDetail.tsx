/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getDb } from '../lib/storage';
import { Trophy, Calendar, Users, Shield, ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '../lib/utils';

export default function SeasonDetail() {
  const { id } = useParams();
  const db = getDb();
  const season = db.seasons.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState<'standings' | 'calendar' | 'teams' | 'drivers'>('standings');

  const driverStandings = useMemo(() => {
    if (!season) return [];
    const results: Record<string, { points: number, wins: number, podiums: number }> = {};
    
    db.races
      .filter(r => r.seasonId === season.id && r.status === 'completed')
      .forEach(r => {
        r.results.forEach(res => {
          if (!results[res.driverId]) results[res.driverId] = { points: 0, wins: 0, podiums: 0 };
          results[res.driverId].points += res.points;
          if (res.position === 1) results[res.driverId].wins += 1;
          if (res.position <= 3) results[res.driverId].podiums += 1;
        });
      });

    return Object.entries(results)
      .sort(([, a], [, b]) => b.points - a.points)
      .map(([id, stats]) => ({
        driver: db.drivers.find(d => d.id === id),
        ...stats
      }));
  }, [id, db]);

  const teamStandings = useMemo(() => {
    if (!season) return [];
    const results: Record<string, number> = {};
    
    db.races
      .filter(r => r.seasonId === season.id && r.status === 'completed')
      .forEach(r => {
        r.results.forEach(res => {
          results[res.teamId] = (results[res.teamId] || 0) + res.points;
        });
      });

    return Object.entries(results)
      .sort(([, a], [, b]) => b - a)
      .map(([id, points]) => ({
        team: db.teams.find(t => t.id === id),
        points
      }));
  }, [id, db]);

  if (!season) return <div className="text-center py-20 uppercase font-black italic text-4xl">Season Not Found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <Link to="/seasons" className="inline-flex items-center space-x-2 text-xs font-bold uppercase text-racing-silver hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            <span>Archive</span>
          </Link>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">{season.year} SEASON</h1>
          <div className="flex items-center space-x-4">
             <span className="text-sm font-bold uppercase px-3 py-1 bg-white/5 text-racing-silver">{season.races.length} Rounds</span>
             <span className="text-sm font-bold uppercase px-3 py-1 bg-white/5 text-racing-silver">{season.drivers.length} Drivers</span>
          </div>
        </div>

        <div className="flex bg-racing-dark p-1 rounded-xl glass-card">
           <TabButton active={activeTab === 'standings'} onClick={() => setActiveTab('standings')} label="Standings" />
           <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} label="Calendar" />
           <TabButton active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} label="Teams" />
           <TabButton active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} label="Drivers" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'standings' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-tight flex items-center space-x-2">
                  <Users className="w-5 h-5 text-racing-red" />
                  <span>Drivers' Championship</span>
                </h2>
                <div className="glass-card">
                  <table className="racing-table">
                    <thead>
                      <tr>
                        <th className="w-12">Pos</th>
                        <th>Driver</th>
                        <th className="hidden sm:table-cell">Wins</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverStandings.map((entry, idx) => (
                        <tr key={entry.driver?.id} className="group">
                          <td className="font-mono font-bold text-lg">{idx + 1}</td>
                          <td>
                            <Link to={`/drivers/${entry.driver?.id}`} className="flex items-center space-x-3 group-hover:text-racing-red transition-colors">
                              <div className="w-1 h-6 bg-racing-red opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="font-bold uppercase">{entry.driver?.name}</div>
                            </Link>
                          </td>
                          <td className="hidden sm:table-cell font-mono text-white/40">{entry.wins}</td>
                          <td className="font-mono font-bold text-xl">{entry.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-4">
                 <h2 className="text-xl font-bold uppercase tracking-tight flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-racing-red" />
                  <span>Constructors' Championship</span>
                </h2>
                <div className="glass-card">
                   <table className="racing-table">
                    <thead>
                      <tr>
                        <th className="w-12">Pos</th>
                        <th>Team</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamStandings.map((entry, idx) => (
                        <tr key={entry.team?.id}>
                          <td className="font-mono font-bold text-lg">{idx + 1}</td>
                          <td>
                             <Link to={`/teams/${entry.team?.id}`} className="flex items-center space-x-3 group">
                              <div className="w-2 h-6" style={{ backgroundColor: entry.team?.primaryColor }} />
                              <div className="font-bold uppercase group-hover:text-racing-red transition-colors">{entry.team?.name}</div>
                            </Link>
                          </td>
                          <td className="font-mono font-bold text-xl">{entry.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
           </div>
        )}

        {/* Other tabs can be implemented similarly */}
        {activeTab === 'calendar' && (
          <div className="text-center py-20 text-racing-silver italic uppercase font-bold tracking-widest bg-white/5 rounded-3xl">Calendar details available via the main Calendar tab.</div>
        )}
        {activeTab === 'teams' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {season.teams.map(id => {
                const team = db.teams.find(t => t.id === id);
                return (
                  <Link key={id} to={`/teams/${id}`} className="glass-card p-6 border-l-4 group" style={{ borderLeftColor: team?.primaryColor }}>
                    <h3 className="text-xl font-bold uppercase group-hover:text-racing-red transition-colors">{team?.name}</h3>
                    <p className="text-xs text-racing-silver uppercase font-bold">{team?.engineSupplier}</p>
                  </Link>
                );
              })}
           </div>
        )}
        {activeTab === 'drivers' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {season.drivers.map(id => {
                const driver = db.drivers.find(d => d.id === id);
                return (
                   <Link key={id} to={`/drivers/${id}`} className="glass-card p-4 group">
                      <div className="text-xs font-bold text-racing-red uppercase leading-none mb-1">{driver?.nationality}</div>
                      <h4 className="text-lg font-bold group-hover:text-racing-red transition-colors italic">{driver?.name}</h4>
                   </Link>
                );
              })}
           </div>
        )}
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
        active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
      )}
    >
      {label}
    </button>
  );
}
