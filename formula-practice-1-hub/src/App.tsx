/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Seasons from './pages/Seasons';
import SeasonDetail from './pages/SeasonDetail';
import Drivers from './pages/Drivers';
import DriverProfile from './pages/DriverProfile';
import Teams from './pages/Teams';
import TeamProfile from './pages/TeamProfile';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Admin from './pages/Admin';
import RaceDetail from './pages/RaceDetail';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-racing-black text-white">
        <Navbar />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/seasons" element={<Seasons />} />
              <Route path="/seasons/:id" element={<SeasonDetail />} />
              <Route path="/races/:id" element={<RaceDetail />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/:id" element={<DriverProfile />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamProfile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  );
}
