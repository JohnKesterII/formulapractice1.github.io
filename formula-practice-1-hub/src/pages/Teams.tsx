/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDb } from '../lib/storage';
import { useState, useMemo } from 'react';

export default function Teams() {
  const db = getDb();
  const [search, setSearch] = useState('');

  const filteredTeams = useMemo(() => {
    return db.teams.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.country.toLowerCase().includes(search.toLowerCase()) ||
      t.engineSupplier.toLowerCase().includes(search.toLowerCase())
    );
  }, [db.teams, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold italic tracking-tighter">TEAMS</h1>
          <p className="text-racing-silver uppercase text-sm font-bold tracking-widest">Constructors & Manufacturers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-silver" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-racing-red transition-all"
            placeholder="Search teams..."
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Link 
            key={team.id} 
            to={`/teams/${team.id}`}
            className="group glass-card border-white/5 hover:border-white/20 transition-all flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: team.primaryColor }} />
            
            <div className="p-8">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <div className="text-[10px] font-bold text-racing-silver uppercase tracking-widest mb-1">{team.country}</div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">{team.name}</h3>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    <Shield className="w-8 h-8" style={{ color: team.primaryColor }} />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-racing-silver uppercase tracking-widest">Engine</div>
                    <div className="text-sm font-bold">{team.engineSupplier}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-racing-silver uppercase tracking-widest">Base</div>
                    <div className="text-sm font-bold">{team.country}</div>
                  </div>
               </div>
            </div>

            <div className="mt-auto p-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-racing-silver group-hover:text-white transition-colors">View Technical Profile</span>
              <ChevronRight className="w-4 h-4 text-racing-silver group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            
            <div className="absolute -bottom-8 -right-8 opacity-5 scale-150 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                <Shield className="w-32 h-32" />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
