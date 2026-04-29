/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getDb } from '../lib/storage';
import { Shield, Trophy, Users, Zap, Globe, Cpu, ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '../lib/utils';

export default function TeamProfile() {
  const { id } = useParams();
  const db = getDb();
  const team = db.teams.find(t => t.id === id);

  const stats = useMemo(() => {
    if (!team) return null;
    const completedRaces = db.races.filter(r => r.status === 'completed');
    const teamResults = completedRaces.flatMap(r => r.results.filter(res => res.teamId === team.id));
    
    const wins = teamResults.filter(p => p.position === 1).length;
    const podiums = teamResults.filter(p => p.position <= 3).length;
    const totalPoints = teamResults.reduce((sum, p) => sum + p.points, 0);
    const titles = db.seasons.filter(s => s.championConstructorId === team.id).length;

    return { wins, podiums, totalPoints, titles, entries: completedRaces.length };
  }, [id, db]);

  const activeDrivers = useMemo(() => {
    if (!team) return [];
    const latestSeason = db.seasons.find(s => s.isActive && s.teams.includes(team.id));
    if (!latestSeason) return [];
    // This is simplified; usually teams store their driver IDs. 
    // In our simplified db, we'll find drivers who have results for this team in the latest season.
    const seasonRaces = db.races.filter(r => r.seasonId === latestSeason.id);
    const driverIds = new Set(seasonRaces.flatMap(r => r.results.filter(res => res.teamId === team.id).map(res => res.driverId)));
    return db.drivers.filter(d => driverIds.has(d.id));
  }, [team, db]);

  if (!team) return <div className="text-center py-20 text-4xl font-black italic uppercase">Constructor Not Found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Link to="/teams" className="inline-flex items-center space-x-2 text-xs font-bold uppercase text-racing-silver hover:text-white transition-colors">
        <ArrowLeft className="w-3 h-3" />
        <span>All Teams</span>
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="glass-card overflow-hidden relative group">
             <div className="h-4 w-full" style={{ backgroundColor: team.primaryColor }} />
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="text-[10px] font-bold text-racing-silver uppercase tracking-widest mb-1">{team.country}</div>
                      <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{team.name}</h1>
                   </div>
                   <Shield className="w-12 h-12" style={{ color: team.primaryColor }} />
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <DetailRow icon={Globe} label="Base" value={team.country} />
                   <DetailRow icon={Cpu} label="Engine" value={team.engineSupplier} />
                   <DetailRow icon={Zap} label="Chassis" value={team.chassis} />
                   <DetailRow icon={Users} label="Principal" value={team.principal} />
                </div>
             </div>
             
             {/* Large background decorative shield */}
             <div className="absolute -bottom-12 -right-12 opacity-5 pointer-events-none transform rotate-12 scale-150">
                <Shield className="w-48 h-48" />
             </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-racing-red uppercase tracking-widest mb-6">Current Driver Lineup</h3>
            <div className="space-y-4">
               {activeDrivers.length > 0 ? activeDrivers.map(driver => (
                 <Link key={driver.id} to={`/drivers/${driver.id}`} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-racing-black flex items-center justify-center font-mono font-bold text-xs border border-white/10 text-racing-silver">{driver.number}</div>
                       <div className="font-bold uppercase text-sm group-hover:text-racing-red transition-colors">{driver.name}</div>
                    </div>
                    <Trophy className="w-4 h-4 text-racing-silver opacity-30 group-hover:opacity-100 transition-opacity" />
                 </Link>
               )) : (
                 <p className="text-xs text-racing-silver italic text-center py-4">No active drivers listed in current season records.</p>
               )}
            </div>
          </div>
        </div>

        {/* Career Stats & Records */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TeamStat label="Championships" value={stats?.titles || 0} icon={Trophy} />
              <TeamStat label="Wins" value={stats?.wins || 0} icon={Zap} />
              <TeamStat label="Podiums" value={stats?.podiums || 0} icon={Shield} />
              <TeamStat label="Points" value={stats?.totalPoints || 0} icon={Globe} />
           </div>

           <div className="glass-card p-1">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                 <h3 className="font-bold uppercase tracking-tight italic">Performance History</h3>
                 <span className="text-[10px] font-bold text-racing-silver uppercase">Total Entries: {stats?.entries}</span>
              </div>
              <div className="p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                 <div className="p-6 bg-white/5 rounded-full">
                    <BarChart2 className="w-12 h-12 text-racing-silver/20" />
                 </div>
                 <h4 className="text-xl font-bold uppercase tracking-tighter opacity-50">Detailed Analytics Locked</h4>
                 <p className="text-xs text-racing-silver max-w-md text-center leading-loose font-bold uppercase tracking-widest italic">
                    Historical season-by-season breakdown and reliability charts are processed in the full Championship Database.
                 </p>
              </div>
           </div>

           <div className="glass-card bg-racing-dark overflow-hidden group">
              <div className="p-8 flex items-center justify-between">
                 <div className="space-y-4 max-w-lg">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">JOIN THE FACTORY</h3>
                    <p className="text-sm text-racing-silver leading-relaxed">
                       Want to manage the strategy for {team.name}? Access the Admin Panel to update their technical specs, refine their lineup, or add recent technical achievements.
                    </p>
                    <Link to="/admin" className="btn-primary">
                       <span>Database Manager</span>
                    </Link>
                 </div>
                 <div className="hidden md:block transform group-hover:rotate-12 transition-transform duration-500">
                    <Cpu className="w-32 h-32 text-racing-silver/10" />
                 </div>
              </div>
           </div>
        </div>
      </section>
    </motion.div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between py-1">
       <div className="flex items-center text-racing-silver">
          <Icon className="w-4 h-4 mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
       </div>
       <span className="font-bold text-sm uppercase">{value}</span>
    </div>
  );
}

function TeamStat({ label, value, icon: Icon }: any) {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-2 border-white/5 backdrop-blur-none bg-racing-dark hover:bg-racing-dark/80 transition-colors">
       <Icon className="w-5 h-5 text-racing-silver/30" />
       <div className="text-4xl font-black italic tracking-tighter uppercase">{value}</div>
       <div className="text-[10px] font-bold uppercase tracking-widest text-racing-silver">{label}</div>
    </div>
  );
}

function BarChart2({ className }: { className?: string }) {
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
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
