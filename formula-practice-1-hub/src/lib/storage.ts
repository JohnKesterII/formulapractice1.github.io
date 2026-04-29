/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Database } from '../types';

const STORAGE_KEY = 'fp1_championship_db';

const INITIAL_DATA: Database = {
  seasons: [
    {
      id: '2026-season',
      year: 2026,
      drivers: [
        'lando-norris',
        'oscar-piastri',
        'charles-leclerc',
        'lewis-hamilton',
        'george-russell',
        'kimi-antonelli',
        'max-verstappen',
        'isack-hadjar',
        'fernando-alonso',
        'lance-stroll',
        'pierre-gasly',
        'franco-colapinto',
        'alex-albon',
        'carlos-sainz',
        'liam-lawson',
        'arvid-lindblad',
        'nico-hulkenberg',
        'gabriel-bortoleto',
        'esteban-ocon',
        'oliver-bearman',
        'sergio-perez',
        'valtteri-bottas'
      ],
      teams: [
        'mclaren',
        'ferrari',
        'mercedes',
        'red-bull',
        'aston-martin',
        'alpine',
        'williams',
        'racing-bulls',
        'audi',
        'haas',
        'cadillac'
      ],
      races: [],
      pointSystem: {
        racePoints: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
        fastestLapPoint: 0
      },
      isActive: true
    }
  ],

  drivers: [
    { id: 'lando-norris', name: 'Lando Norris', nationality: 'United Kingdom', age: 26, number: 1, biography: 'Reigning World Champion driving for McLaren in 2026.', activeYears: [2026], stats: { pace: 96, racecraft: 94, experience: 86, awareness: 91 } },
    { id: 'oscar-piastri', name: 'Oscar Piastri', nationality: 'Australia', age: 24, number: 81, biography: 'McLaren driver known for calm race execution and strong pace.', activeYears: [2026], stats: { pace: 95, racecraft: 94, experience: 82, awareness: 92 } },
    { id: 'charles-leclerc', name: 'Charles Leclerc', nationality: 'Monaco', age: 28, number: 16, biography: 'Ferrari driver with elite qualifying speed.', activeYears: [2026], stats: { pace: 97, racecraft: 91, experience: 88, awareness: 89 } },
    { id: 'lewis-hamilton', name: 'Lewis Hamilton', nationality: 'United Kingdom', age: 41, number: 44, biography: 'Seven-time World Champion racing for Ferrari.', activeYears: [2026], stats: { pace: 93, racecraft: 98, experience: 99, awareness: 96 } },
    { id: 'george-russell', name: 'George Russell', nationality: 'United Kingdom', age: 28, number: 63, biography: 'Mercedes driver and early 2026 race winner.', activeYears: [2026], stats: { pace: 94, racecraft: 91, experience: 86, awareness: 92 } },
    { id: 'kimi-antonelli', name: 'Kimi Antonelli', nationality: 'Italy', age: 19, number: 12, biography: 'Mercedes rookie and 2026 Grand Prix winner.', activeYears: [2026], stats: { pace: 94, racecraft: 88, experience: 68, awareness: 84 } },
    { id: 'max-verstappen', name: 'Max Verstappen', nationality: 'Netherlands', age: 28, number: 3, biography: 'Multiple-time World Champion racing for Red Bull.', activeYears: [2026], stats: { pace: 99, racecraft: 98, experience: 94, awareness: 96 } },
    { id: 'isack-hadjar', name: 'Isack Hadjar', nationality: 'France', age: 21, number: 6, biography: 'Promoted to Red Bull Racing for the 2026 season.', activeYears: [2026], stats: { pace: 88, racecraft: 83, experience: 70, awareness: 80 } },
    { id: 'fernando-alonso', name: 'Fernando Alonso', nationality: 'Spain', age: 44, number: 14, biography: 'Veteran Aston Martin driver with elite racecraft.', activeYears: [2026], stats: { pace: 90, racecraft: 99, experience: 99, awareness: 98 } },
    { id: 'lance-stroll', name: 'Lance Stroll', nationality: 'Canada', age: 27, number: 18, biography: 'Aston Martin driver with strong starts and wet-weather flashes.', activeYears: [2026], stats: { pace: 79, racecraft: 78, experience: 84, awareness: 76 } },
    { id: 'pierre-gasly', name: 'Pierre Gasly', nationality: 'France', age: 30, number: 10, biography: 'Alpine driver leading the team into the 2026 regulations.', activeYears: [2026], stats: { pace: 87, racecraft: 88, experience: 89, awareness: 87 } },
    { id: 'franco-colapinto', name: 'Franco Colapinto', nationality: 'Argentina', age: 22, number: 43, biography: 'Alpine driver retained for the 2026 season.', activeYears: [2026], stats: { pace: 82, racecraft: 79, experience: 66, awareness: 76 } },
    { id: 'alex-albon', name: 'Alexander Albon', nationality: 'Thailand', age: 30, number: 23, biography: 'Williams driver known for extracting strong results from difficult cars.', activeYears: [2026], stats: { pace: 87, racecraft: 86, experience: 87, awareness: 90 } },
    { id: 'carlos-sainz', name: 'Carlos Sainz', nationality: 'Spain', age: 31, number: 55, biography: 'Williams driver with strong race management and consistency.', activeYears: [2026], stats: { pace: 90, racecraft: 91, experience: 92, awareness: 90 } },
    { id: 'liam-lawson', name: 'Liam Lawson', nationality: 'New Zealand', age: 24, number: 30, biography: 'Racing Bulls driver continuing in the Red Bull system.', activeYears: [2026], stats: { pace: 86, racecraft: 83, experience: 74, awareness: 81 } },
    { id: 'arvid-lindblad', name: 'Arvid Lindblad', nationality: 'United Kingdom', age: 18, number: 41, biography: 'Racing Bulls rookie making his F1 debut in 2026.', activeYears: [2026], stats: { pace: 84, racecraft: 79, experience: 58, awareness: 74 } },
    { id: 'nico-hulkenberg', name: 'Nico Hulkenberg', nationality: 'Germany', age: 38, number: 27, biography: 'Audi driver bringing experience to the new works team.', activeYears: [2026], stats: { pace: 84, racecraft: 86, experience: 96, awareness: 88 } },
    { id: 'gabriel-bortoleto', name: 'Gabriel Bortoleto', nationality: 'Brazil', age: 21, number: 5, biography: 'Audi driver and young Brazilian talent.', activeYears: [2026], stats: { pace: 84, racecraft: 81, experience: 68, awareness: 78 } },
    { id: 'esteban-ocon', name: 'Esteban Ocon', nationality: 'France', age: 29, number: 31, biography: 'Haas driver with race-winning experience.', activeYears: [2026], stats: { pace: 84, racecraft: 85, experience: 90, awareness: 83 } },
    { id: 'oliver-bearman', name: 'Oliver Bearman', nationality: 'United Kingdom', age: 20, number: 87, biography: 'Haas driver with strong junior pedigree and growing F1 experience.', activeYears: [2026], stats: { pace: 86, racecraft: 82, experience: 67, awareness: 78 } },
    { id: 'sergio-perez', name: 'Sergio Pérez', nationality: 'Mexico', age: 36, number: 11, biography: 'Cadillac driver returning to the grid with the new American team.', activeYears: [2026], stats: { pace: 84, racecraft: 89, experience: 97, awareness: 87 } },
    { id: 'valtteri-bottas', name: 'Valtteri Bottas', nationality: 'Finland', age: 36, number: 77, biography: 'Cadillac driver bringing race-winning experience to the new team.', activeYears: [2026], stats: { pace: 85, racecraft: 86, experience: 97, awareness: 88 } }
  ],

  teams: [
    { id: 'mclaren', name: 'McLaren Formula 1 Team', country: 'United Kingdom', engineSupplier: 'Mercedes', chassis: 'MCL40', principal: 'Andrea Stella', primaryColor: '#FF8000', secondaryColor: '#000000', activeYears: [2026] },
    { id: 'ferrari', name: 'Scuderia Ferrari HP', country: 'Italy', engineSupplier: 'Ferrari', chassis: 'SF-26', principal: 'Frédéric Vasseur', primaryColor: '#DC0000', secondaryColor: '#FFF200', activeYears: [2026] },
    { id: 'mercedes', name: 'Mercedes-AMG Petronas Formula One Team', country: 'Germany', engineSupplier: 'Mercedes', chassis: 'W17', principal: 'Toto Wolff', primaryColor: '#00A19C', secondaryColor: '#C0C0C0', activeYears: [2026] },
    { id: 'red-bull', name: 'Oracle Red Bull Racing', country: 'Austria', engineSupplier: 'Red Bull Ford Powertrains', chassis: 'RB22', principal: 'Christian Horner', primaryColor: '#0600EF', secondaryColor: '#FFCC00', activeYears: [2026] },
    { id: 'aston-martin', name: 'Aston Martin Aramco Formula One Team', country: 'United Kingdom', engineSupplier: 'Honda', chassis: 'AMR26', principal: 'Andy Cowell', primaryColor: '#006F62', secondaryColor: '#CEDC00', activeYears: [2026] },
    { id: 'alpine', name: 'BWT Alpine Formula One Team', country: 'France', engineSupplier: 'Mercedes', chassis: 'A526', principal: 'Flavio Briatore', primaryColor: '#0090FF', secondaryColor: '#FF87BC', activeYears: [2026] },
    { id: 'williams', name: 'Atlassian Williams Racing', country: 'United Kingdom', engineSupplier: 'Mercedes', chassis: 'FW48', principal: 'James Vowles', primaryColor: '#005AFF', secondaryColor: '#FFFFFF', activeYears: [2026] },
    { id: 'racing-bulls', name: 'Visa Cash App Racing Bulls Formula One Team', country: 'Italy', engineSupplier: 'Red Bull Ford Powertrains', chassis: 'VCARB 03', principal: 'Laurent Mekies', primaryColor: '#1E41FF', secondaryColor: '#FFFFFF', activeYears: [2026] },
    { id: 'audi', name: 'Audi Formula 1 Team', country: 'Germany', engineSupplier: 'Audi', chassis: 'A26', principal: 'Mattia Binotto', primaryColor: '#C0C0C0', secondaryColor: '#FF0000', activeYears: [2026] },
    { id: 'haas', name: 'MoneyGram Haas F1 Team', country: 'United States', engineSupplier: 'Ferrari', chassis: 'VF-26', principal: 'Ayao Komatsu', primaryColor: '#FFFFFF', secondaryColor: '#E6002B', activeYears: [2026] },
    { id: 'cadillac', name: 'Cadillac Formula 1 Team', country: 'United States', engineSupplier: 'Ferrari', chassis: 'MAC-26', principal: 'Graeme Lowdon', primaryColor: '#111111', secondaryColor: '#D4AF37', activeYears: [2026] }
  ],

  circuits: [
    { id: 'albert-park', name: 'Albert Park Circuit', country: 'Australia', length: 5.278, turns: 14, description: 'Street-style circuit in Melbourne.', activeYears: [2026] },
    { id: 'portimao', name: 'Algarve International Circuit', country: 'Portugal', length: 4.653, turns: 15, description: 'Rollercoaster circuit in the Algarve.', activeYears: [2026] },
    { id: 'imola', name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', length: 4.909, turns: 19, description: 'Classic anti-clockwise track in Imola.', activeYears: [2026] },
    { id: 'mexico-city', name: 'Autódromo Hermanos Rodríguez', country: 'Mexico', length: 4.304, turns: 17, description: 'High-altitude circuit in Mexico City.', activeYears: [2026] },
    { id: 'interlagos', name: 'Autódromo José Carlos Pace', country: 'Brazil', length: 4.309, turns: 15, description: 'Short, intense lap in São Paulo.', activeYears: [2026] },
    { id: 'monza', name: 'Autodromo Nazionale Monza', country: 'Italy', length: 5.793, turns: 11, description: 'The Temple of Speed.', activeYears: [2026] },
    { id: 'bahrain', name: 'Bahrain International Circuit', country: 'Bahrain', length: 5.412, turns: 15, description: 'Desert night racing specialist.', activeYears: [2026] },
    { id: 'baku', name: 'Baku City Circuit', country: 'Azerbaijan', length: 6.003, turns: 20, description: 'Longest straight on the calendar.', activeYears: [2026] },
    { id: 'buddh', name: 'Buddh International Circuit', country: 'India', length: 5.125, turns: 16, description: 'Technical track near New Delhi.', activeYears: [2026] },
    { id: 'barcelona', name: 'Circuit de Barcelona-Catalunya', country: 'Spain', length: 4.675, turns: 16, description: 'Balanced testing ground.', activeYears: [2026] },
    { id: 'monaco', name: 'Circuit de Monaco', country: 'Monaco', length: 3.337, turns: 19, description: 'The crown jewel of Formula 1.', activeYears: [2026] },
    { id: 'magny-cours', name: 'Circuit de Nevers Magny-Cours', country: 'France', length: 4.411, turns: 17, description: 'Former French GP home.', activeYears: [2026] },
    { id: 'paul-ricard', name: 'Circuit Paul Ricard', country: 'France', length: 5.842, turns: 15, description: 'Famous for its blue runoff areas.', activeYears: [2026] },
    { id: 'spa', name: 'Circuit de Spa-Francorchamps', country: 'Belgium', length: 7.004, turns: 20, description: 'The majestic Ardennes circuit.', activeYears: [2026] },
    { id: 'montreal', name: 'Circuit Gilles Villeneuve', country: 'Canada', length: 4.361, turns: 14, description: 'Island track in Montreal.', activeYears: [2026] },
    { id: 'cota', name: 'Circuit of the Americas', country: 'USA', length: 5.513, turns: 20, description: 'Modern classic in Austin.', activeYears: [2026] },
    { id: 'dallas', name: 'Dallas Fair Park Circuit', country: 'USA', length: 3.901, turns: 21, description: 'Historic street circuit.', activeYears: [2026] },
    { id: 'detroit', name: 'Detroit Street Circuit', country: 'USA', length: 2.647, turns: 9, description: 'Tight downtown racing.', activeYears: [2026] },
    { id: 'estoril', name: 'Estoril Circuit', country: 'Portugal', length: 4.182, turns: 13, description: 'Historic Portuguese track.', activeYears: [2026] },
    { id: 'fuji', name: 'Fuji Speedway', country: 'Japan', length: 4.563, turns: 16, description: 'Circuit at the base of Mt. Fuji.', activeYears: [2026] },
    { id: 'hockenheim', name: 'Hockenheimring', country: 'Germany', length: 4.574, turns: 17, description: 'Classic German venue.', activeYears: [2026] },
    { id: 'hungaroring', name: 'Hungaroring', country: 'Hungary', length: 4.381, turns: 14, description: 'Monaco without the walls.', activeYears: [2026] },
    { id: 'indianapolis', name: 'Indianapolis Motor Speedway', country: 'USA', length: 4.192, turns: 13, description: 'The legendary brickyard.', activeYears: [2026] },
    { id: 'istanbul', name: 'Istanbul Park', country: 'Turkey', length: 5.338, turns: 14, description: 'Home of the famous Turn 8.', activeYears: [2026] },
    { id: 'jeddah', name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', length: 6.174, turns: 27, description: 'World’s fastest street circuit.', activeYears: [2026] },
    { id: 'jerez', name: 'Jerez Circuit', country: 'Spain', length: 4.428, turns: 13, description: 'Technical Spanish testing track.', activeYears: [2026] },
    { id: 'yeongam', name: 'Korean International Circuit', country: 'South Korea', length: 5.615, turns: 18, description: 'Semi-permanent track in 영암군.', activeYears: [2026] },
    { id: 'kyalami', name: 'Kyalami Circuit', country: 'South Africa', length: 4.529, turns: 16, description: 'Premier African racing venue.', activeYears: [2026] },
    { id: 'las-vegas-strip', name: 'Las Vegas Strip Circuit', country: 'USA', length: 6.201, turns: 17, description: 'Night racing through the icons of Vegas.', activeYears: [2026] },
    { id: 'losail', name: 'Losail International Circuit', country: 'Qatar', length: 5.419, turns: 16, description: 'Fast and flowing desert track.', activeYears: [2026] },
    { id: 'singapore', name: 'Marina Bay Street Circuit', country: 'Singapore', length: 4.940, turns: 19, description: 'Physical and humid night race.', activeYears: [2026] },
    { id: 'miami', name: 'Miami International Autodrome', country: 'USA', length: 5.412, turns: 19, description: 'Temporary circuit around Hard Rock Stadium.', activeYears: [2026] },
    { id: 'nurburgring', name: 'Nürburgring', country: 'Germany', length: 5.148, turns: 16, description: 'Historic home of German motor racing.', activeYears: [2026] },
    { id: 'phoenix', name: 'Phoenix Street Circuit', country: 'USA', length: 3.720, turns: 15, description: 'Historic Arizona concrete canyons.', activeYears: [2026] },
    { id: 'red-bull-ring', name: 'Red Bull Ring', country: 'Austria', length: 4.318, turns: 10, description: 'High-speed track in the Alps.', activeYears: [2026] },
    { id: 'sepang', name: 'Sepang International Circuit', country: 'Malaysia', length: 5.543, turns: 15, description: 'Tropical humidity and wide corners.', activeYears: [2026] },
    { id: 'shanghai', name: 'Shanghai International Circuit', country: 'China', length: 5.451, turns: 16, description: 'Technical track with the long back straight.', activeYears: [2026] },
    { id: 'silverstone', name: 'Silverstone Circuit', country: 'UK', length: 5.891, turns: 18, description: 'The home of British motor racing.', activeYears: [2026] },
    { id: 'suzuka', name: 'Suzuka Circuit', country: 'Japan', length: 5.807, turns: 18, description: 'Legendary figure-eight layout.', activeYears: [2026] },
    { id: 'valencia', name: 'Valencia Street Circuit', country: 'Spain', length: 5.419, turns: 25, description: 'Former Mediterranean harbor track.', activeYears: [2026] },
    { id: 'yas-marina', name: 'Yas Marina Circuit', country: 'UAE', length: 5.281, turns: 16, description: 'The twilight finale venue.', activeYears: [2026] },
    { id: 'zandvoort', name: 'Zandvoort Circuit', country: 'Netherlands', length: 4.259, turns: 14, description: 'Banking corners at the North Sea coast.', activeYears: [2026] }
  ],

  races: [],

  news: []
};

export const getDb = (): Database => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing database:', e);
    return INITIAL_DATA;
  }
};

export const saveDb = (db: Database) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const resetDb = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  window.location.reload();
};
