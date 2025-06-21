export interface PathPoint {
  x: number;
  y: number;
  time: number; // in seconds
}

export interface CharacterPath {
  name: string;
  color?: string;
  path: PathPoint[];
}

// Helper to generate a random position
const randomXY = () => ({
  x: Math.floor(Math.random() * window.innerWidth),
  y: Math.floor(Math.random() * window.innerHeight),
});

// Time array to keep motion smooth
const times = Array.from({ length: 31 }, (_, i) => i * 5);

const generateRandomPath = (): PathPoint[] =>
  times.map(time => ({ ...randomXY(), time }));

export const characters: CharacterPath[] = [
  { name: 'Harry Potter', color: '#FFD700', path: generateRandomPath() },
  { name: 'Hermione Granger', color: '#E6E6FA', path: generateRandomPath() },
  { name: 'Ron Weasley', color: '#FFD700', path: generateRandomPath() },
  { name: 'Draco Malfoy', color: '#FFD700', path: generateRandomPath() },
  { name: 'Luna Lovegood', color: '#E6E6FA', path: generateRandomPath() },
  { name: 'Neville Longbottom', color: '#FFD700', path: generateRandomPath() },
  { name: 'Ginny Weasley', color: '#E6E6FA', path: generateRandomPath() },
  { name: 'Albus Dumbledore', color: '#FFD700', path: generateRandomPath() },
  { name: 'Severus Snape', color: '#E6E6FA', path: generateRandomPath() },
];
