/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Users, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDb } from '../lib/storage';
import { useState, useMemo } from 'react';

export default function Drivers() {
  const db = getDb();
  const [search, setSearch] = useState('');

  const filteredDrivers = useMemo(() => {
    return db.drivers.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.nationality.toLowerCase().includes(search.toLowerCase())
    );
  }, [db.drivers, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold italic tracking-tighter">DRIVERS</h1>
          <p className="text-racing-silver uppercase text-sm font-bold tracking-widest">Entry List & History</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-silver" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-racing-red transition-all"
            placeholder="Search drivers..."
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDrivers.map((driver) => (
          <Link 
            key={driver.id} 
            to={`/drivers/${driver.id}`}
            className="group glass-card hover:border-white/20 transition-all flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-racing-dark">
              <img 
                 src={`https://picsum.photos/seed/${driver.id}/400/300`} 
                 alt={driver.name} 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                 referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-racing-black to-transparent">
                <div className="text-4xl font-extrabold italic text-white/20 group-hover:text-racing-red/20 transition-colors uppercase leading-none">
                  {driver.number}
                </div>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-racing-red uppercase tracking-widest mb-1">{driver.nationality}</div>
                <h3 className="text-xl font-bold uppercase truncate">{driver.name}</h3>
              </div>
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex -space-x-1">
                    {[1,2,3,4].map(s => (
                      <div key={s} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    ))}
                 </div>
                 <ChevronRight className="w-4 h-4 text-racing-silver group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
