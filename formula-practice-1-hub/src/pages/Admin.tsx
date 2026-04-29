/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, Plus, Trash2, Trophy, Users, Shield, Calendar, MapPin, Database, RefreshCw, Upload, Download, BarChart3, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { getDb, saveDb, resetDb } from '../lib/storage';
import { cn } from '../lib/utils';
import { Driver, Team, Season, Circuit, Database as DbType, Race, RaceResult } from '../types';

const syncEntityToSeasons = (
  currentDb: DbType, 
  entityId: string, 
  years: number[], 
  listKey: 'drivers' | 'teams'
): DbType => {
  return {
    ...currentDb,
    seasons: currentDb.seasons.map(s => {
      const shouldInclude = years.includes(s.year);
      const isIncluded = s[listKey].includes(entityId);
      
      if (shouldInclude && !isIncluded) {
        return { ...s, [listKey]: [...s[listKey], entityId] };
      } else if (!shouldInclude && isIncluded) {
        return { ...s, [listKey]: s[listKey].filter(id => id !== entityId) };
      }
      return s;
    })
  };
};

export default function Admin() {
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [db, setDb] = useState<DbType>(getDb());
  const [activeTab, setActiveTab] = useState<'seasons' | 'drivers' | 'teams' | 'circuits' | 'races' | 'news' | 'system'>('seasons');
  const [isSaved, setIsSaved] = useState(true);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === 'Papaya123') {
      setIsAuthorized(true);
    } else {
      alert('Unauthorized access. Invalid passcode.');
    }
  };

  const handleSave = () => {
    saveDb(db);
    setIsSaved(true);
    alert('Database updated successfully!');
  };

  const updateDb = (newDb: DbType) => {
    setDb(newDb);
    setIsSaved(false);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `fp1_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-md w-full text-center space-y-6"
        >
          <div className="w-16 h-16 bg-racing-red rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black italic uppercase italic">Restricted Access</h2>
          <p className="text-sm text-racing-silver">Enter system administrator passcode to manage the F-Practice 1 infrastructure.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-racing-black border border-white/10 rounded-lg p-3 text-center tracking-widest"
              placeholder="••••••••"
              autoFocus
            />
            <button type="submit" className="w-full btn-primary bg-white text-black hover:bg-racing-red hover:text-white border-none py-3">
              Authorize Access
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-[0.8]">DATA MANAGER</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Control center for the Formula Practice 1 database</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isSaved && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-racing-red/10 border border-racing-red/20 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-racing-red animate-pulse" />
              <span className="text-[10px] font-bold text-racing-red uppercase">Unsaved Changes</span>
            </div>
          )}
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            <span>Update DB</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Rail */}
        <aside className="lg:col-span-1 space-y-2">
          <AdminTab icon={Trophy} label="Seasons" id="seasons" active={activeTab === 'seasons'} onClick={setActiveTab} />
          <AdminTab icon={Calendar} label="Races" id="races" active={activeTab === 'races'} onClick={setActiveTab} />
          <AdminTab icon={Users} label="Drivers" id="drivers" active={activeTab === 'drivers'} onClick={setActiveTab} />
          <AdminTab icon={Shield} label="Teams" id="teams" active={activeTab === 'teams'} onClick={setActiveTab} />
          <AdminTab icon={MapPin} label="Circuits" id="circuits" active={activeTab === 'circuits'} onClick={setActiveTab} />
          <AdminTab icon={Database} label="News" id="news" active={activeTab === 'news'} onClick={setActiveTab} />
          <AdminTab icon={Settings} label="System" id="system" active={activeTab === 'system'} onClick={setActiveTab} />
          
          <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-racing-silver uppercase tracking-widest mb-2">Tools</h3>
            <button
               onClick={handleExport}
               className="w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-gray-500 hover:text-white hover:bg-racing-card border border-transparent hover:border-racing-border transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <Download className="w-4 h-4" />
              <span>Export System</span>
            </button>
             <button
               onClick={() => {
                 if (confirm('Are you sure? This will wipe all current data and restore defaults.')) resetDb();
               }}
               className="w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-red-900 hover:text-racing-red hover:bg-racing-red/5 border border-transparent hover:border-racing-red/20 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Hard Reset</span>
            </button>
          </div>
        </aside>

        {/* Editor Area */}
        <div className="lg:col-span-3 min-h-[600px] glass-card p-6">
          {activeTab === 'seasons' && <SeasonManager db={db} updateDb={updateDb} />}
          {activeTab === 'drivers' && <DriverManager db={db} updateDb={updateDb} />}
          {activeTab === 'teams' && <TeamManager db={db} updateDb={updateDb} />}
          {activeTab === 'circuits' && <CircuitManager db={db} updateDb={updateDb} />}
          {activeTab === 'races' && <RaceManager db={db} updateDb={updateDb} />}
          {activeTab === 'news' && <NewsManager db={db} updateDb={updateDb} />}
          {activeTab === 'system' && <SystemManager db={db} updateDb={updateDb} />}
        </div>
      </div>
    </motion.div>
  );
}

function AdminTab({ icon: Icon, label, id, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 transition-all font-display font-bold uppercase text-[11px] tracking-widest rounded-sm",
        active 
          ? "bg-racing-red text-white shadow-xl shadow-racing-red/10 border-l-4 border-white" 
          : "text-gray-500 hover:text-white hover:bg-racing-card border-l-4 border-transparent"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

// Sub-components for Managers

function DriverManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Driver>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedDrivers = useMemo(() => {
    return [...db.drivers].sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const res = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortOrder === 'asc' ? res : -res;
    });
  }, [db.drivers, sortField, sortOrder]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const yearsStr = formData.get('activeYears') as string;
    const activeYears = yearsStr ? yearsStr.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y)) : [];
    
    const driverData: Driver = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      nationality: formData.get('nationality') as string,
      age: parseInt(formData.get('age') as string),
      number: parseInt(formData.get('number') as string),
      biography: formData.get('biography') as string,
      activeYears,
      stats: {
        pace: parseInt(formData.get('pace') as string),
        racecraft: parseInt(formData.get('racecraft') as string),
        experience: parseInt(formData.get('experience') as string),
        awareness: parseInt(formData.get('awareness') as string),
      }
    };

    let newDb = { ...db };
    if (editingId) {
      newDb.drivers = db.drivers.map(d => d.id === editingId ? driverData : d);
      setEditingId(null);
    } else {
      if (db.drivers.some(d => d.id === driverData.id)) {
        alert('Driver ID already exists');
        return;
      }
      newDb.drivers = [...db.drivers, driverData];
      setIsAdding(false);
    }

    newDb = syncEntityToSeasons(newDb, driverData.id, activeYears, 'drivers');
    updateDb(newDb);
  };

  const deleteDriver = (id: string) => {
    if (confirm('Delete this driver? This will also remove them from all seasons.')) {
      const newDrivers = db.drivers.filter(d => d.id !== id);
      const newSeasons = db.seasons.map(s => ({
        ...s,
        drivers: s.drivers.filter(dId => dId !== id)
      }));
      updateDb({ ...db, drivers: newDrivers, seasons: newSeasons });
    }
  };

  const editingDriver = editingId ? db.drivers.find(d => d.id === editingId) : null;

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...db.drivers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    updateDb({ ...db, drivers: newList });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Drivers</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          <span>New Driver</span>
        </button>
      </div>

      {(isAdding || editingId) && (
         <div className="glass-card p-6 border-racing-red/30">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Unique ID</label>
                <input name="id" required defaultValue={editingDriver?.id} readOnly={!!editingId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="max-verdasco" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Full Name</label>
                <input name="name" required defaultValue={editingDriver?.name} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="Max Verstappen" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Nationality</label>
                <input name="nationality" required defaultValue={editingDriver?.nationality} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="Netherlands" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Age</label>
                <input name="age" type="number" required defaultValue={editingDriver?.age} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Driver Number</label>
                <input name="number" type="number" required defaultValue={editingDriver?.number} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Active Years (Comma separated)</label>
                <input name="activeYears" defaultValue={editingDriver?.activeYears?.join(', ')} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="2024, 2025" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Biography</label>
                <textarea name="biography" defaultValue={editingDriver?.biography} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" rows={3} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-racing-silver">Pace</label>
                  <input name="pace" type="number" defaultValue={editingDriver?.stats?.pace || 80} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-racing-silver">Racecraft</label>
                  <input name="racecraft" type="number" defaultValue={editingDriver?.stats?.racecraft || 80} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-racing-silver">Experience</label>
                  <input name="experience" type="number" defaultValue={editingDriver?.stats?.experience || 80} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-racing-silver">Awareness</label>
                  <input name="awareness" type="number" defaultValue={editingDriver?.stats?.awareness || 80} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-sm uppercase font-bold text-white/60">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update Driver' : 'Add Driver'}</button>
              </div>
           </form>
         </div>
      )}

      <table className="racing-table">
        <thead>
          <tr>
            <th className="w-16">Order</th>
            <th onClick={() => { setSortField('id'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">ID</th>
            <th onClick={() => { setSortField('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">Name</th>
            <th onClick={() => { setSortField('number'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">Number</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedDrivers.map((d, index) => (
            <tr key={d.id}>
              <td>
                <div className="flex flex-col">
                  <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveItem(index, 'down')} disabled={index === db.drivers.length - 1} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="font-mono text-xs opacity-60">{d.id}</td>
              <td className="font-bold">{d.name}</td>
              <td>{d.number}</td>
              <td className="text-right space-x-2">
                <button onClick={() => setEditingId(d.id)} className="p-1 text-racing-silver hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={() => deleteDriver(d.id)} className="p-1 text-racing-silver hover:text-racing-red transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Similarly for Teams, Seasons, etc. - adding placeholders for now to save space, but functional
function TeamManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Team>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedTeams = useMemo(() => {
    return [...db.teams].sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const res = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortOrder === 'asc' ? res : -res;
    });
  }, [db.teams, sortField, sortOrder]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const yearsStr = formData.get('activeYears') as string;
    const activeYears = yearsStr ? yearsStr.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y)) : [];

    const teamData: Team = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      country: formData.get('country') as string,
      engineSupplier: formData.get('engineSupplier') as string,
      chassis: formData.get('chassis') as string,
      principal: formData.get('principal') as string,
      primaryColor: formData.get('primaryColor') as string,
      secondaryColor: '#FFFFFF',
      activeYears
    };

    let newDb = { ...db };
    if (editingId) {
      newDb.teams = db.teams.map(t => t.id === editingId ? teamData : t);
      setEditingId(null);
    } else {
      if (db.teams.some(t => t.id === teamData.id)) {
        alert('Team ID already exists');
        return;
      }
      newDb.teams = [...db.teams, teamData];
      setIsAdding(false);
    }

    newDb = syncEntityToSeasons(newDb, teamData.id, activeYears, 'teams');
    updateDb(newDb);
  };

  const deleteTeam = (id: string) => {
    if (confirm('Delete this team? This will remove them from all seasons.')) {
      updateDb({ 
        ...db, 
        teams: db.teams.filter(t => t.id !== id),
        seasons: db.seasons.map(s => ({ ...s, teams: s.teams.filter(tId => tId !== id) }))
      });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...db.teams];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    updateDb({ ...db, teams: newList });
  };

  const editingTeam = editingId ? db.teams.find(t => t.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Teams</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          <span>New Team</span>
        </button>
      </div>

      {(isAdding || editingId) && (
         <div className="glass-card p-6 border-racing-red/30">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Unique ID</label>
                <input name="id" required defaultValue={editingTeam?.id} readOnly={!!editingId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="mclaren" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Team Name</label>
                <input name="name" required defaultValue={editingTeam?.name} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="McLaren Practice" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Country</label>
                <input name="country" required defaultValue={editingTeam?.country} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="UK" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Engine Supplier</label>
                <input name="engineSupplier" required defaultValue={editingTeam?.engineSupplier} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="Mercedes" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Chassis</label>
                <input name="chassis" required defaultValue={editingTeam?.chassis} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Team Principal</label>
                <input name="principal" required defaultValue={editingTeam?.principal} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
               <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Primary Color (Hex)</label>
                <input name="primaryColor" type="color" defaultValue={editingTeam?.primaryColor || "#DC0000"} className="w-full h-10 bg-racing-black border border-white/10 rounded-lg p-1" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Active Years (Comma separated)</label>
                <input name="activeYears" defaultValue={editingTeam?.activeYears?.join(', ')} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="2024, 2025" />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-sm uppercase font-bold text-white/60">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update Team' : 'Add Team'}</button>
              </div>
           </form>
         </div>
      )}

      <table className="racing-table">
        <thead>
          <tr>
            <th className="w-16">Order</th>
            <th onClick={() => { setSortField('id'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">ID</th>
            <th onClick={() => { setSortField('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">Name</th>
            <th>Color</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((t, index) => (
            <tr key={t.id}>
              <td>
                <div className="flex flex-col">
                  <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveItem(index, 'down')} disabled={index === db.teams.length - 1} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="font-mono text-xs opacity-60">{t.id}</td>
              <td className="font-bold">{t.name}</td>
              <td><div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primaryColor }} /></td>
              <td className="text-right space-x-2">
                <button onClick={() => setEditingId(t.id)} className="p-1 text-racing-silver hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTeam(t.id)} className="p-1 text-racing-silver hover:text-racing-red transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CircuitManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Circuit>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedCircuits = useMemo(() => {
    return [...db.circuits].sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const res = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortOrder === 'asc' ? res : -res;
    });
  }, [db.circuits, sortField, sortOrder]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const yearsStr = formData.get('activeYears') as string;
    const activeYears = yearsStr ? yearsStr.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y)) : [];

    const circuitData: Circuit = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      country: formData.get('country') as string,
      length: parseFloat(formData.get('length') as string),
      turns: parseInt(formData.get('turns') as string),
      description: formData.get('description') as string,
      activeYears
    };

    if (editingId) {
      updateDb({ ...db, circuits: db.circuits.map(c => c.id === editingId ? circuitData : c) });
      setEditingId(null);
    } else {
      updateDb({ ...db, circuits: [...db.circuits, circuitData] });
      setIsAdding(false);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...db.circuits];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    updateDb({ ...db, circuits: newList });
  };

  const editingCircuit = editingId ? db.circuits.find(c => c.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Circuits</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          <span>New Circuit</span>
        </button>
      </div>

      {(isAdding || editingId) && (
         <div className="glass-card p-6 border-racing-red/30">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Circuit ID</label>
                <input name="id" required defaultValue={editingCircuit?.id} readOnly={!!editingId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="silverstone" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Full Name</label>
                <input name="name" required defaultValue={editingCircuit?.name} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="Silverstone Circuit" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Country</label>
                <input name="country" required defaultValue={editingCircuit?.country} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Length (km)</label>
                <input name="length" type="number" step="0.001" required defaultValue={editingCircuit?.length} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Turns</label>
                <input name="turns" type="number" required defaultValue={editingCircuit?.turns} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Active Years (Comma separated)</label>
                <input name="activeYears" defaultValue={editingCircuit?.activeYears?.join(', ')} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="2024, 2025" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Description</label>
                <textarea name="description" defaultValue={editingCircuit?.description} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" rows={3} />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-sm uppercase font-bold text-white/60">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update Circuit' : 'Add Circuit'}</button>
              </div>
           </form>
         </div>
      )}

      <table className="racing-table">
        <thead>
          <tr>
            <th className="w-16">Order</th>
            <th onClick={() => { setSortField('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">Name</th>
            <th onClick={() => { setSortField('country'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="cursor-pointer hover:text-racing-red transition-colors">Country</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCircuits.map((c, index) => (
            <tr key={c.id}>
              <td>
                <div className="flex flex-col">
                  <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveItem(index, 'down')} disabled={index === db.circuits.length - 1} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="font-bold">{c.name}</td>
              <td>{c.country}</td>
              <td className="text-right space-x-2">
                <button onClick={() => setEditingId(c.id)} className="p-1 text-racing-silver hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={() => {
                  if (confirm('Delete this circuit?')) {
                    updateDb({ ...db, circuits: db.circuits.filter(circ => circ.id !== c.id) });
                  }
                }} className="p-1 text-racing-silver hover:text-racing-red transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RaceManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingRaceId, setEditingRaceId] = useState<string | null>(null);
  const [editingResultsId, setEditingResultsId] = useState<string | null>(null);

  const handleSubmitRace = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raceData: Race = {
      id: formData.get('id') as string,
      seasonId: formData.get('seasonId') as string,
      round: parseInt(formData.get('round') as string),
      name: formData.get('name') as string,
      circuitId: formData.get('circuitId') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as any,
      status: (formData.get('status') as any) || 'upcoming',
      results: editingRaceId ? (db.races.find(r => r.id === editingRaceId)?.results || []) : [],
      sprintResults: editingRaceId ? (db.races.find(r => r.id === editingRaceId)?.sprintResults || []) : [],
    };

    let newDb = { ...db };
    if (editingRaceId) {
      newDb.races = db.races.map(r => r.id === editingRaceId ? raceData : r);
      setEditingRaceId(null);
    } else {
      if (db.races.some(r => r.id === raceData.id)) {
        alert('Race ID already exists');
        return;
      }
      newDb.races = [...db.races, raceData];
      setIsAdding(false);
    }
    
    // Ensure race is in season's race list
    newDb.seasons = newDb.seasons.map(s => {
      if (s.id === raceData.seasonId) {
        if (!s.races.includes(raceData.id)) return { ...s, races: [...s.races, raceData.id] };
      } else {
        if (s.races.includes(raceData.id)) return { ...s, races: s.races.filter(id => id !== raceData.id) };
      }
      return s;
    });

    updateDb(newDb);
  };

  const handleResultSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingResultsId) return;
    const formData = new FormData(e.currentTarget);
    const driverId = formData.get('driverId') as string;
    const teamId = formData.get('teamId') as string;
    const position = parseInt(formData.get('position') as string);
    const points = parseInt(formData.get('points') as string);
    const resultType = formData.get('resultType') as 'race' | 'sprint';

    const race = db.races.find(r => r.id === editingResultsId);
    if (!race) return;

    const newResult: RaceResult = {
      driverId,
      teamId,
      position,
      grid: parseInt(formData.get('grid') as string),
      fastestLap: formData.get('fastestLap') === 'on',
      dnf: formData.get('dnf') === 'on',
      points
    };

    const updatedRaces = db.races.map(r => {
      if (r.id === editingResultsId) {
        if (resultType === 'sprint') {
          const sprintResults = r.sprintResults || [];
          const filtered = sprintResults.filter(res => res.driverId !== driverId);
          return { ...r, status: 'completed' as const, sprintResults: [...filtered, newResult] };
        } else {
          const filteredResults = r.results.filter(res => res.driverId !== driverId);
          return { ...r, status: 'completed' as const, results: [...filteredResults, newResult] };
        }
      }
      return r;
    });

    updateDb({ ...db, races: updatedRaces });
  };

  const deleteRace = (id: string) => {
    if (confirm('Delete this race? All its results will be lost.')) {
      const newRaces = db.races.filter(r => r.id !== id);
      const newSeasons = db.seasons.map(s => ({
        ...s,
        races: s.races.filter(rId => rId !== id)
      }));
      updateDb({ ...db, races: newRaces, seasons: newSeasons });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...db.races];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    updateDb({ ...db, races: newList });
  };

  const editingRace = editingRaceId ? db.races.find(r => r.id === editingRaceId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Races</h2>
        <div className="flex space-x-2">
           {editingResultsId && (
             <button onClick={() => setEditingResultsId(null)} className="btn-outline text-xs">
                <span>Back to List</span>
             </button>
           )}
           <button onClick={() => setIsAdding(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            <span>New Race</span>
          </button>
        </div>
      </div>

      {(isAdding || editingRaceId) && (
         <div className="glass-card p-6 bg-white/5 border-racing-red/30">
           <form onSubmit={handleSubmitRace} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Race ID</label>
                <input name="id" required defaultValue={editingRace?.id} readOnly={!!editingRaceId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="monaco-2026" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Season</label>
                <select name="seasonId" defaultValue={editingRace?.seasonId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   {db.seasons.map(s => <option key={s.id} value={s.id}>{s.year}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Race Name</label>
                <input name="name" required defaultValue={editingRace?.name} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" placeholder="Monaco Grand Prix" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Circuit</label>
                <select name="circuitId" defaultValue={editingRace?.circuitId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   {db.circuits.slice().sort((a,b) => a.name.localeCompare(b.name)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Round #</label>
                <input name="round" type="number" required defaultValue={editingRace?.round || (db.races.length > 0 ? Math.max(...db.races.map(r => r.round)) + 1 : 1)} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Date</label>
                <input name="date" type="date" required defaultValue={editingRace?.date} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Type</label>
                <select name="type" defaultValue={editingRace?.type} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   <option value="Grand Prix">Grand Prix</option>
                   <option value="Sprint">Sprint</option>
                   <option value="Practice">Practice</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Status</label>
                <select name="status" defaultValue={editingRace?.status} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   <option value="upcoming">Upcoming</option>
                   <option value="completed">Completed</option>
                   <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingRaceId(null); }} className="px-4 py-2 text-sm uppercase font-bold text-white/60">Cancel</button>
                <button type="submit" className="btn-primary">{editingRaceId ? 'Update Race' : 'Add Race'}</button>
              </div>
           </form>
         </div>
      )}

      {editingResultsId ? (
        <div className="space-y-6">
           <div className="glass-card p-6 bg-white/5 border-racing-red/20">
              <h3 className="font-bold uppercase text-sm mb-4">Add Result for {db.races.find(r => r.id === editingResultsId)?.name}</h3>
              <form onSubmit={handleResultSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {db.races.find(r => r.id === editingResultsId)?.type === 'Sprint' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase">Session</label>
                      <select name="resultType" className="w-full bg-racing-black border border-white/10 rounded-lg p-1.5 text-xs">
                         <option value="race">Grand Prix</option>
                         <option value="sprint">Sprint</option>
                      </select>
                    </div>
                  )}
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase">Driver</label>
                   <select name="driverId" className="w-full bg-racing-black border border-white/10 rounded-lg p-1.5 text-xs">
                      {db.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase">Team</label>
                   <select name="teamId" className="w-full bg-racing-black border border-white/10 rounded-lg p-1.5 text-xs">
                      {db.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase">Pos</label>
                   <input name="position" type="number" required className="w-full bg-racing-black border border-white/10 rounded-lg p-1.5 text-xs" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase">Points</label>
                   <input name="points" type="number" required className="w-full bg-racing-black border border-white/10 rounded-lg p-1.5 text-xs" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase">Grid</label>
                   <input name="grid" type="number" required className="w-full bg-racing-black border border-white/10 rounded-lg p-1.5 text-xs" />
                 </div>
                 <div className="flex items-center space-x-4 pt-4">
                    <label className="flex items-center space-x-2 text-[10px] uppercase font-bold">
                       <input name="fastestLap" type="checkbox" />
                       <span>FL</span>
                    </label>
                    <label className="flex items-center space-x-2 text-[10px] uppercase font-bold text-red-400">
                       <input name="dnf" type="checkbox" />
                       <span>DNF</span>
                    </label>
                 </div>
                 <div className="pt-2">
                    <button type="submit" className="w-full btn-primary text-[10px] py-1">Add Entry</button>
                 </div>
              </form>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-card">
                  <h4 className="text-[10px] font-bold uppercase p-2 border-b border-white/5">Grand Prix Results</h4>
                  <table className="racing-table">
                     <thead>
                        <tr><th>P</th><th>Driver</th><th>Pts</th><th>Actions</th></tr>
                     </thead>
                     <tbody>
                        {db.races.find(r => r.id === editingResultsId)?.results.slice().sort((a,b) => a.position-b.position).map(res => (
                          <tr key={res.driverId}>
                             <td>P{res.position}</td>
                             <td className="font-bold text-racing-red">{db.drivers.find(d => d.id === res.driverId)?.name}</td>
                             <td>{res.points}</td>
                             <td>
                                <button onClick={() => {
                                  const updatedRaces = db.races.map(r => {
                                    if (r.id === editingResultsId) {
                                      return { ...r, results: r.results.filter(rs => rs.driverId !== res.driverId) };
                                    }
                                    return r;
                                  });
                                  updateDb({ ...db, races: updatedRaces });
                                }} className="p-1 text-red-900 group-hover:text-racing-red transition-all"><Trash2 className="w-3 h-3" /></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               {db.races.find(r => r.id === editingResultsId)?.type === 'Sprint' && (
                  <div className="glass-card">
                    <h4 className="text-[10px] font-bold uppercase p-2 border-b border-white/5">Sprint Results</h4>
                    <table className="racing-table">
                       <thead>
                          <tr><th>P</th><th>Driver</th><th>Pts</th><th>Actions</th></tr>
                       </thead>
                       <tbody>
                          {(db.races.find(r => r.id === editingResultsId)?.sprintResults || []).slice().sort((a,b) => a.position-b.position).map(res => (
                            <tr key={res.driverId}>
                               <td>P{res.position}</td>
                               <td className="font-bold text-racing-red">{db.drivers.find(d => d.id === res.driverId)?.name}</td>
                               <td>{res.points}</td>
                               <td>
                                  <button onClick={() => {
                                    const updatedRaces = db.races.map(r => {
                                      if (r.id === editingResultsId) {
                                        return { ...r, sprintResults: (r.sprintResults || []).filter(rs => rs.driverId !== res.driverId) };
                                      }
                                      return r;
                                    });
                                    updateDb({ ...db, races: updatedRaces });
                                  }} className="p-1 text-red-900 group-hover:text-racing-red transition-all"><Trash2 className="w-3 h-3" /></button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               )}
            </div>
        </div>
      ) : (
        <div className="space-y-4">
          {db.races.map((race, index) => (
             <div key={race.id} className="glass-card p-4 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === db.races.length - 1} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div onClick={() => setEditingResultsId(race.id)} className="cursor-pointer">
                    <div className="text-[10px] font-bold text-racing-red uppercase">{race.date} • Round {race.round}</div>
                    <div className="font-bold uppercase tracking-tight group-hover:text-racing-red transition-all">{race.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded", race.status === 'completed' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500")}>
                     {race.status}
                   </span>
                    <button onClick={() => setEditingRaceId(race.id)} className="p-2 hover:bg-white/5 rounded-lg text-racing-silver hover:text-white" title="Edit Race Details"><Settings className="w-4 h-4" /></button>
                   <button onClick={() => setEditingResultsId(race.id)} className="p-2 hover:bg-white/5 rounded-lg text-racing-silver hover:text-white" title="Edit Results"><BarChart3 className="w-4 h-4" /></button>
                   <button onClick={() => deleteRace(race.id)} className="p-2 hover:bg-white/5 rounded-lg text-racing-silver hover:text-racing-red" title="Delete Race"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeasonManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addSeason = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSeason: Season = {
      id: `season-${formData.get('year')}`,
      year: parseInt(formData.get('year') as string),
      drivers: db.drivers.map(d => d.id),
      teams: db.teams.map(t => t.id),
      races: [],
      pointSystem: {
        racePoints: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
        fastestLapPoint: 1
      },
      isActive: formData.get('active') === 'true'
    };
    updateDb({ ...db, seasons: [...db.seasons, newSeason] });
    setIsAdding(false);
  };

  const toggleItemInSeason = (seasonId: string, listKey: 'drivers' | 'teams' | 'races', itemId: string) => {
    const updatedSeasons = db.seasons.map(s => {
      if (s.id === seasonId) {
        const list = s[listKey] || [];
        const newList = list.includes(itemId) 
          ? list.filter(id => id !== itemId)
          : [...list, itemId];
        return { ...s, [listKey]: newList };
      }
      return s;
    });

    // If it's a race, also update the race's seasonId for consistency
    let updatedRaces = db.races;
    if (listKey === 'races') {
      updatedRaces = db.races.map(r => {
        if (r.id === itemId) {
          const season = db.seasons.find(s => s.id === seasonId);
          const isRemoving = season?.races.includes(itemId);
          return { ...r, seasonId: isRemoving ? '' : seasonId };
        }
        return r;
      });
    }

    updateDb({ ...db, seasons: updatedSeasons, races: updatedRaces });
  };

  const updateSeason = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    const formData = new FormData(e.currentTarget);
    const updatedSeasons = db.seasons.map(s => {
      if (s.id === editingId) {
        return {
          ...s,
          championDriverId: formData.get('championDriverId') as string || undefined,
          championConstructorId: formData.get('championConstructorId') as string || undefined,
          isActive: formData.get('active') === 'true'
        };
      }
      return s;
    });
    updateDb({ ...db, seasons: updatedSeasons });
    setEditingId(null);
  };

  const deleteSeason = (id: string) => {
    if (confirm('Delete this season? All linked races will remain in the database but be unlinked.')) {
      updateDb({ ...db, seasons: db.seasons.filter(s => s.id !== id) });
    }
  };

  const moveSeason = (index: number, direction: 'up' | 'down') => {
    const newSeasons = [...db.seasons];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSeasons.length) return;
    [newSeasons[index], newSeasons[newIndex]] = [newSeasons[newIndex], newSeasons[index]];
    updateDb({ ...db, seasons: newSeasons });
  };

  const editingSeason = editingId ? db.seasons.find(s => s.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Seasons</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          <span>New Season</span>
        </button>
      </div>

       {isAdding && (
         <div className="glass-card p-6 bg-white/5 border-racing-red/30">
           <form onSubmit={addSeason} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Year</label>
                <input name="year" type="number" required defaultValue={2027} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Set as Active</label>
                <select name="active" className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   <option value="true">Yes</option>
                   <option value="false">No</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-sm uppercase font-bold text-white/60">Cancel</button>
                <button type="submit" className="btn-primary">Initialize Season</button>
              </div>
           </form>
         </div>
      )}

      {editingSeason && (
         <div className="glass-card p-6 border-racing-red/40 space-y-8">
           <div className="flex items-center justify-between">
             <h3 className="font-bold underline decoration-racing-red decoration-2 underline-offset-4 uppercase italic">Configuring {editingSeason.year} Season</h3>
             <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
           </div>
           
           <form onSubmit={updateSeason} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Active Status</label>
                <select name="active" defaultValue={editingSeason.isActive ? 'true' : 'false'} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   <option value="true">Active</option>
                   <option value="false">Inactive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Driver Champion</label>
                <select name="championDriverId" defaultValue={editingSeason.championDriverId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   <option value="">None</option>
                   {db.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Constructor Champion</label>
                <select name="championConstructorId" defaultValue={editingSeason.championConstructorId} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                   <option value="">None</option>
                   {db.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="btn-primary">Update Basic Info</button>
              </div>
           </form>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Season Drivers */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 bg-racing-red inline-block italic">Participating Drivers</h4>
                <div className="max-h-64 overflow-y-auto space-y-1 pr-2 thin-scrollbar">
                  {db.drivers.map(d => {
                    const isIncluded = editingSeason.drivers.includes(d.id);
                    return (
                      <button 
                        key={d.id} 
                        onClick={() => toggleItemInSeason(editingSeason.id, 'drivers', d.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded text-xs transition-colors",
                          isIncluded ? "bg-racing-red/20 border border-racing-red/30 text-white" : "bg-white/5 border border-white/5 text-racing-silver hover:border-white/20"
                        )}
                      >
                        <span className="font-bold">{d.name}</span>
                        {isIncluded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-30" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Season Teams */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 bg-racing-red inline-block italic">Participating Teams</h4>
                <div className="max-h-64 overflow-y-auto space-y-1 pr-2 thin-scrollbar">
                  {db.teams.map(t => {
                    const isIncluded = editingSeason.teams.includes(t.id);
                    return (
                      <button 
                        key={t.id} 
                        onClick={() => toggleItemInSeason(editingSeason.id, 'teams', t.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded text-xs transition-colors",
                          isIncluded ? "bg-racing-red/20 border border-racing-red/30 text-white" : "bg-white/5 border border-white/5 text-racing-silver hover:border-white/20"
                        )}
                      >
                        <span className="font-bold">{t.name}</span>
                        {isIncluded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-30" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Season Races */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 bg-racing-red inline-block italic">Assigned Races</h4>
                <div className="max-h-64 overflow-y-auto space-y-1 pr-2 thin-scrollbar">
                  {db.races.map(r => {
                    const isIncluded = editingSeason.races.includes(r.id);
                    return (
                      <button 
                        key={r.id} 
                        onClick={() => toggleItemInSeason(editingSeason.id, 'races', r.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded text-xs transition-colors text-left",
                          isIncluded ? "bg-racing-red/20 border border-racing-red/30 text-white" : "bg-white/5 border border-white/5 text-racing-silver hover:border-white/20"
                        )}
                      >
                        <div>
                          <div className="font-bold">{r.name}</div>
                          <div className="text-[8px] opacity-60 uppercase">Round {r.round} • {r.date}</div>
                        </div>
                        {isIncluded ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 opacity-30 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[9px] text-racing-silver italic leading-tight">* Races can also be assigned in the Races tab by setting their Season ID.</p>
              </div>
           </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {db.seasons.map((s, index) => (
            <div key={s.id} className="glass-card p-6 flex justify-between items-center group">
               <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <button onClick={() => moveSeason(index, 'up')} disabled={index === 0} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => moveSeason(index, 'down')} disabled={index === db.seasons.length - 1} className="p-0.5 hover:text-racing-red disabled:opacity-20 transition-colors">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase leading-none">{s.year}</h3>
                    <div className="text-[10px] font-bold text-racing-silver uppercase mt-1">
                      {s.races?.length || 0} Races • {s.drivers?.length || 0} Drivers • {s.teams?.length || 0} Teams
                    </div>
                    {s.championDriverId && (
                      <div className="text-[10px] font-bold text-racing-red uppercase mt-1 underline decoration-racing-red/30">
                        Champion: {db.drivers.find(d => d.id === s.championDriverId)?.name}
                      </div>
                    )}
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  {s.isActive && <span className="p-1 bg-racing-red rounded-full animate-pulse" />}
                  <button onClick={() => setEditingId(s.id)} className="p-2 text-racing-silver hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                  <button onClick={() => deleteSeason(s.id)} className="p-2 text-racing-silver hover:text-racing-red transition-colors"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function SystemManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [json, setJson] = useState(JSON.stringify(db, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(json);
      updateDb(parsed);
      setError(null);
      alert('System configuration updated successfully.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Configuration</h2>
        <button onClick={handleApply} className="btn-primary">Apply Changes</button>
      </div>
      <div className="glass-card p-6">
        <p className="text-xs text-racing-silver mb-4 uppercase font-bold tracking-widest">Raw Database JSON (Advanced Users Only)</p>
        <textarea 
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="w-full h-[500px] bg-racing-black border border-white/10 rounded-lg p-4 font-mono text-xs leading-relaxed text-racing-silver focus:text-white focus:border-racing-red/50 transition-all outline-none"
        />
        {error && <div className="mt-4 p-4 bg-racing-red/20 border border-racing-red text-racing-red text-xs font-bold uppercase">{error}</div>}
      </div>
      
      <div className="flex justify-between items-center bg-racing-red/10 border border-racing-red/30 p-6 rounded-xl">
        <div>
          <h3 className="font-black italic uppercase text-racing-red">Danger Zone</h3>
          <p className="text-xs text-racing-silver">Wipe all local changes and reset to system defaults.</p>
        </div>
        <button 
          onClick={() => {
            if (confirm('Are you absolutely sure? This will delete all your custom races, drivers, and settings.')) {
              resetDb();
            }
          }}
          className="px-6 py-2 bg-racing-red text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-racing-red transition-all"
        >
          Factory Reset
        </button>
      </div>
    </div>
  );
}

function NewsManager({ db, updateDb }: { db: DbType, updateDb: (db: DbType) => void }) {
  const [isAdding, setIsAdding] = useState(false);

  const addNews = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEntry = {
      id: `news-${Date.now()}`,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as any,
    };
    updateDb({ ...db, news: [...db.news, newEntry] });
    setIsAdding(false);
  };

  const deleteNews = (id: string) => {
    if (confirm('Delete this news post?')) {
      updateDb({ ...db, news: db.news.filter(n => n.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage News Posts</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          <span>New Post</span>
        </button>
      </div>

      {isAdding && (
         <div className="glass-card p-6 bg-white/5">
           <form onSubmit={addNews} className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Title</label>
                <input name="title" required className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-racing-silver">Type</label>
                  <select name="type" className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm">
                    <option value="Race Result">Race Result</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Technical">Technical</option>
                    <option value="Financial">Financial</option>
                    <option value="Interview">Interview</option>
                    <option value="Preview">Preview</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-racing-silver">Date</label>
                  <input name="date" type="date" required className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-racing-silver">Content</label>
                <textarea name="content" required rows={5} className="w-full bg-racing-black border border-white/10 rounded-lg p-2 text-sm" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm uppercase font-bold text-white/60">Cancel</button>
                <button type="submit" className="btn-primary">Publish Post</button>
              </div>
           </form>
         </div>
      )}

      <div className="space-y-4">
         {db.news.sort((a,b) => b.date.localeCompare(a.date)).map(news => (
            <div key={news.id} className="glass-card p-4 flex items-center justify-between group">
               <div>
                  <div className="text-[10px] font-bold text-racing-red uppercase">{news.date} • {news.type}</div>
                  <div className="font-bold uppercase tracking-tight">{news.title}</div>
               </div>
               <button onClick={() => deleteNews(news.id)} className="p-2 text-racing-silver hover:text-racing-red">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         ))}
      </div>
    </div>
  );
}

