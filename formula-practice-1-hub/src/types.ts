/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RaceType = 'Grand Prix' | 'Sprint' | 'Qualifying' | 'Practice' | 'Testing';

export interface Driver {
  id: string;
  name: string;
  nationality: string;
  age: number;
  number: number;
  biography: string;
  activeYears: number[];
  helmetUrl?: string;
  stats?: {
    pace: number;
    racecraft: number;
    experience: number;
    awareness: number;
  };
}

export interface Team {
  id: string;
  name: string;
  country: string;
  engineSupplier: string;
  chassis: string;
  principal: string;
  primaryColor: string;
  secondaryColor: string;
  activeYears: number[];
  liveryUrl?: string;
}

export interface Circuit {
  id: string;
  name: string;
  country: string;
  length: number; // km
  turns: number;
  description: string;
  activeYears: number[];
}

export interface RaceResult {
  driverId: string;
  teamId: string;
  position: number;
  grid: number;
  fastestLap: boolean;
  dnf: boolean;
  penaltySeconds?: number;
  penaltyPoints?: number;
  points: number;
}

export interface Race {
  id: string;
  seasonId: string;
  round: number;
  name: string;
  circuitId: string;
  date: string;
  type: RaceType;
  status: 'upcoming' | 'completed' | 'cancelled';
  results: RaceResult[];
  sprintResults?: RaceResult[];
  summary?: string;
  poleSitterId?: string;
}

export interface PointSystem {
  racePoints: number[]; // Index 0 is 1st place, etc.
  fastestLapPoint: number;
  sprintPoints?: number[];
}

export interface Season {
  id: string;
  year: number;
  drivers: string[]; // Driver IDs
  teams: string[]; // Team IDs
  races: string[]; // Race IDs
  pointSystem: PointSystem;
  championDriverId?: string;
  championConstructorId?: string;
  isActive: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'Race Result' | 'Transfer' | 'Technical' | 'Financial' | 'Interview' | 'Preview';
}

export interface Database {
  seasons: Season[];
  drivers: Driver[];
  teams: Team[];
  circuits: Circuit[];
  races: Race[];
  news: NewsPost[];
}
