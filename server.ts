import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

// Middleware
app.use(express.json());

// Initialize Local JSON Database
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      profiles: [],
      sessions: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database.json:', err);
    return { users: [], profiles: [], sessions: [] };
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving database.json:', err);
  }
}

// User Helpers
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Simple Cookie Parser Helper
function getSessionToken(req: express.Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );
  return cookies['netclone_session'] || null;
}

// Mock Movie Catalog
const MOVIES = [
  {
    id: 'stranger-sagas',
    title: 'Stranger Sagas',
    synopsis: 'When a young boy vanishes from a small Indiana town, his friends uncover a web of secret government experiments, terrifying supernatural forces, and an extraordinary, mysterious girl.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Trending Now',
    year: '2025',
    duration: '45m',
    rating: 'TV-14',
    tags: ['Suspenseful', 'Sci-Fi', 'Nostalgic']
  },
  {
    id: 'cyber-heist',
    title: 'The Cyber Heist',
    synopsis: 'An elite team of digital outlaws plans the heist of the century: hacking into the world\'s most secure megacorporation bank during a global blackout.',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Action & Thrillers',
    year: '2026',
    duration: '2h 15m',
    rating: 'R',
    tags: ['Action', 'Cyberpunk', 'Thrilling']
  },
  {
    id: 'stellar-odyssey',
    title: 'Stellar Odyssey',
    synopsis: 'A group of brave astronauts embark on an interstellar journey through a newly discovered wormhole in search of a new home for dying humanity.',
    thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Sci-Fi & Fantasy',
    year: '2024',
    duration: '2h 49m',
    rating: 'PG-13',
    tags: ['Cerebral', 'Space', 'Visually Stunning']
  },
  {
    id: 'chefs-secret',
    title: 'Chef\'s Secret',
    synopsis: 'A passionate fine-dining chef suddenly loses his job and decides to restart his life by opening a premium street food truck, rediscovering his love for rustic culinary arts.',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Comedies',
    year: '2023',
    duration: '1h 55m',
    rating: 'PG-13',
    tags: ['Inspiring', 'Heartfelt', 'Culinary']
  },
  {
    id: 'shadow-assassin',
    title: 'Shadow Assassin',
    synopsis: 'An ancient clan\'s deadliest warrior turns rogue to protect an innocent orphan girl from the very syndicate that trained him from childhood.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Action & Thrillers',
    year: '2025',
    duration: '2h 02m',
    rating: 'R',
    tags: ['Action', 'Martial Arts', 'Dark']
  },
  {
    id: 'retro-love',
    title: 'Retro Love',
    synopsis: 'Two hopeless dreamers cross paths in a nostalgic 1980s neon-lit coastal town, sparking an unforgettable summer romance filled with mixtapes and ocean drives.',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Comedies',
    year: '2024',
    duration: '1h 48m',
    rating: 'PG-13',
    tags: ['Romantic', 'Nostalgic', 'Feel-Good']
  },
  {
    id: 'deep-blue-abyss',
    title: 'Deep Blue Abyss',
    synopsis: 'Submerge into the alien wonders of Earth\'s deepest marine trenches, uncovering bioluminescent life forms and secret underwater mountain ranges.',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Trending Now',
    year: '2025',
    duration: '1h 22m',
    rating: 'TV-G',
    tags: ['Documentary', 'Breathtaking', 'Nature']
  },
  {
    id: 'the-last-kingdom',
    title: 'The Last Kingdom',
    synopsis: 'As medieval rivalries tear empires apart, a young prince raised in exile must reclaim his family\'s legendary throne and unite the fractured realms.',
    thumbnail: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Sci-Fi & Fantasy',
    year: '2023',
    duration: '2h 28m',
    rating: 'TV-MA',
    tags: ['Epic', 'Swordplay', 'Fantasy']
  },
  {
    id: 'silicon-valley-dream',
    title: 'Silicon Valley Dream',
    synopsis: 'Four young developers build a revolutionary artificial intelligence algorithm in a tiny garage, only to face corporate greed and comical betrayals.',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Comedies',
    year: '2026',
    duration: '1h 50m',
    rating: 'TV-MA',
    tags: ['Tech', 'Sarcastic', 'Witty']
  },
  {
    id: 'formula-speed',
    title: 'Formula Speed',
    synopsis: 'Experience the adrenaline, rivalries, and split-second decisions that define the highest-speed automotive racing circuits in the world.',
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Action & Thrillers',
    year: '2025',
    duration: '1h 58m',
    rating: 'PG-13',
    tags: ['Exciting', 'Racing', 'High Octane']
  },
  {
    id: 'cosmic-odyssey',
    title: 'Cosmic Journey',
    synopsis: 'A cosmic saga detailing the creation, expansion, and future of the universe through mind-bending astrophysics and visual effects.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Sci-Fi & Fantasy',
    year: '2025',
    duration: '1h 35m',
    rating: 'TV-G',
    tags: ['Astrophysics', 'Cosmic', 'Educational']
  },
  {
    id: 'laugh-factory',
    title: 'The Laugh Factory',
    synopsis: 'A hilarious stand-up compilation of world-class comedians telling jokes about relationships, modern technology, and daily absurdities.',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=400&q=80',
    backdrop: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Comedies',
    year: '2024',
    duration: '1h 10m',
    rating: 'R',
    tags: ['Hilarious', 'Witty', 'Stand-Up']
  }
];

// Auth Endpoint: Register
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDB();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = crypto.randomUUID();

  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash,
    salt,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Initialize with 4 default Netflix-inspired profiles
  const profileColors = ['#E50914', '#1f80e0', '#32cd32', '#f5b800', '#7a28cb'];
  const profileNames = ['Primary', 'Friends', 'Family', 'Kids'];
  const defaultProfiles = profileNames.map((name, idx) => ({
    id: crypto.randomUUID(),
    userId,
    name,
    avatarColor: profileColors[idx],
    isKids: name === 'Kids',
    myList: []
  }));

  db.profiles.push(...defaultProfiles);
  saveDB(db);

  // Generate Session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.sessions.push({ token, userId, expiresAt });
  saveDB(db);

  res.setHeader('Set-Cookie', `netclone_session=${token}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`);
  return res.json({
    user: { id: userId, email: newUser.email },
    profiles: defaultProfiles
  });
});

// Auth Endpoint: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ error: 'Incorrect email or password' });
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    return res.status(400).json({ error: 'Incorrect email or password' });
  }

  // Generate Session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.sessions.push({ token, userId: user.id, expiresAt });
  saveDB(db);

  const userProfiles = db.profiles.filter((p: any) => p.userId === user.id);

  res.setHeader('Set-Cookie', `netclone_session=${token}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`);
  return res.json({
    user: { id: user.id, email: user.email },
    profiles: userProfiles
  });
});

// Auth Endpoint: Logout
app.post('/api/auth/logout', (req, res) => {
  const token = getSessionToken(req);
  if (token) {
    const db = loadDB();
    db.sessions = db.sessions.filter((s: any) => s.token !== token);
    saveDB(db);
  }
  res.setHeader('Set-Cookie', 'netclone_session=; Path=/; HttpOnly; Max-Age=0');
  return res.json({ success: true });
});

// Auth Endpoint: Get Current User
app.get('/api/auth/me', (req, res) => {
  const token = getSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = loadDB();
  const session = db.sessions.find((s: any) => s.token === token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.users.find((u: any) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const userProfiles = db.profiles.filter((p: any) => p.userId === user.id);

  return res.json({
    user: { id: user.id, email: user.email },
    profiles: userProfiles
  });
});

// Profile Management: Get profiles
app.get('/api/profiles', (req, res) => {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDB();
  const session = db.sessions.find((s: any) => s.token === token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const userProfiles = db.profiles.filter((p: any) => p.userId === session.userId);
  return res.json(userProfiles);
});

// Profile Management: Create profile
app.post('/api/profiles', (req, res) => {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDB();
  const session = db.sessions.find((s: any) => s.token === token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { name, isKids, avatarColor } = req.body;
  if (!name) return res.status(400).json({ error: 'Profile name is required' });

  const currentProfiles = db.profiles.filter((p: any) => p.userId === session.userId);
  if (currentProfiles.length >= 5) {
    return res.status(400).json({ error: 'Maximum of 5 profiles allowed' });
  }

  const newProfile = {
    id: crypto.randomUUID(),
    userId: session.userId,
    name,
    avatarColor: avatarColor || '#E50914',
    isKids: !!isKids,
    myList: []
  };

  db.profiles.push(newProfile);
  saveDB(db);

  return res.json(newProfile);
});

// Profile Management: Delete profile
app.delete('/api/profiles/:id', (req, res) => {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDB();
  const session = db.sessions.find((s: any) => s.token === token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const profileId = req.params.id;
  const profileIndex = db.profiles.findIndex((p: any) => p.id === profileId && p.userId === session.userId);

  if (profileIndex === -1) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  db.profiles.splice(profileIndex, 1);
  saveDB(db);

  return res.json({ success: true });
});

// Profile Management: Add movie to Profile "My List"
app.post('/api/profiles/:id/mylist', (req, res) => {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDB();
  const session = db.sessions.find((s: any) => s.token === token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const profileId = req.params.id;
  const { movieId } = req.body;

  const profile = db.profiles.find((p: any) => p.id === profileId && p.userId === session.userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  if (!profile.myList.includes(movieId)) {
    profile.myList.push(movieId);
    saveDB(db);
  }

  return res.json(profile);
});

// Profile Management: Remove movie from Profile "My List"
app.delete('/api/profiles/:id/mylist/:movieId', (req, res) => {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDB();
  const session = db.sessions.find((s: any) => s.token === token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const profileId = req.params.id;
  const movieId = req.params.movieId;

  const profile = db.profiles.find((p: any) => p.id === profileId && p.userId === session.userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  profile.myList = profile.myList.filter((mId: string) => mId !== movieId);
  saveDB(db);

  return res.json(profile);
});

// Movie Catalog Endpoints
app.get('/api/movies', (req, res) => {
  return res.json(MOVIES);
});

// Implement Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
