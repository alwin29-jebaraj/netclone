// Transparent API Interceptor for Client-side Static Deployments (e.g., GitHub Pages)
// This enables full sign-up, login, multiple profiles management, and watchlists
// completely offline and serverless when deployed statically!

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

// Helper to check if we should run in client-only mode
const isStaticOrOffline = () => {
  return (
    window.location.hostname.endsWith('github.io') || 
    window.location.hostname.endsWith('netlify.app') || 
    window.location.hostname.endsWith('vercel.app') ||
    localStorage.getItem('netclone_force_offline') === 'true'
  );
};

// Simulated Local Storage Database
const getLocalDB = () => {
  const users = JSON.parse(localStorage.getItem('netclone_mock_users') || '[]');
  const profiles = JSON.parse(localStorage.getItem('netclone_mock_profiles') || '[]');
  const sessionToken = localStorage.getItem('netclone_mock_session_token') || null;
  return { users, profiles, sessionToken };
};

const saveLocalDB = ({ users, profiles, sessionToken }) => {
  if (users !== undefined) localStorage.setItem('netclone_mock_users', JSON.stringify(users));
  if (profiles !== undefined) localStorage.setItem('netclone_mock_profiles', JSON.stringify(profiles));
  if (sessionToken !== undefined) {
    if (sessionToken === null) {
      localStorage.removeItem('netclone_mock_session_token');
    } else {
      localStorage.setItem('netclone_mock_session_token', sessionToken);
    }
  }
};

// Patch window.fetch with transparent interception
const originalFetch = window.fetch;

export const apiFetch = async function (input, init) {
  const url = typeof input === 'string' ? input : input.url;
  
  // If it's not an API call, let it go through as-is
  if (!url.includes('/api/')) {
    return originalFetch ? originalFetch.apply(this, arguments) : Promise.reject('No native fetch available');
  }

  // If we are definitely on GitHub Pages or a static host, bypass real fetch immediately to prevent CORS/404 latency or noise
  if (isStaticOrOffline()) {
    return handleMockAPI(url, init);
  }

  // Otherwise, try the real API call, but gracefully catch any non-JSON or connection errors
  try {
    const response = await originalFetch.apply(this, arguments);
    
    // Check if the response is actually valid JSON or if it's a 404 HTML fallback page
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      return response;
    }
    
    // If we get an HTML or invalid response on API endpoints, it means the server is missing/not running, fallback!
    if (contentType.includes('text/html') || response.status === 404) {
      console.warn('API route not found on server, fallback to client-side localStorage simulation');
      localStorage.setItem('netclone_force_offline', 'true');
      return handleMockAPI(url, init);
    }

    return response;
  } catch (err) {
    console.warn('API server connection failed, fallback to client-side localStorage simulation:', err);
    localStorage.setItem('netclone_force_offline', 'true');
    return handleMockAPI(url, init);
  }
};

// Use Object.defineProperty to bypass read-only getter issues in some iframe/sandboxed environments
try {
  Object.defineProperty(window, 'fetch', {
    value: apiFetch,
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn('Failed to define fetch on window using Object.defineProperty, trying direct assignment:', e);
  try {
    // Only attempt direct assignment if defineProperty failed and we are in a non-strict context where it might work
    // But guard it with its own catch so a read-only getter TypeError doesn't bubble up!
    window.fetch = apiFetch;
  } catch (err) {
    console.warn('Failed to patch window.fetch completely (read-only getter). Native fetch remains untouched, but custom apiFetch will be used directly.', err);
  }
}

// Simulated router and response builder
function createJSONResponse(data, status = 200) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  return new Response(blob, {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function handleMockAPI(url, init) {
  const method = (init && init.method ? init.method.toUpperCase() : 'GET');
  const body = init && init.body ? JSON.parse(init.body) : null;
  const db = getLocalDB();

  // Helper to get currently authenticated user from local storage token
  const getLoggedInUser = () => {
    if (!db.sessionToken) return null;
    return db.users.find(u => u.id === db.sessionToken) || null;
  };

  // 1. GET /api/movies
  if (url.endsWith('/api/movies')) {
    return createJSONResponse(MOVIES);
  }

  // 2. POST /api/auth/register
  if (url.endsWith('/api/auth/register') && method === 'POST') {
    const { email, password } = body;
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return createJSONResponse({ error: 'An account with this email already exists' }, 400);
    }

    const userId = 'user_' + Math.random().toString(36).substring(2, 9);
    const newUser = { id: userId, email: email.toLowerCase() };
    db.users.push(newUser);

    // Default Netclone profiles
    const profileColors = ['#E50914', '#1f80e0', '#32cd32', '#f5b800', '#7a28cb'];
    const profileNames = ['Primary', 'Friends', 'Family', 'Kids'];
    const defaultProfiles = profileNames.map((name, idx) => ({
      id: 'profile_' + Math.random().toString(36).substring(2, 9),
      userId,
      name,
      avatarColor: profileColors[idx],
      isKids: name === 'Kids',
      myList: []
    }));

    db.profiles.push(...defaultProfiles);
    db.sessionToken = userId;
    saveLocalDB(db);

    return createJSONResponse({
      user: newUser,
      profiles: defaultProfiles
    });
  }

  // 3. POST /api/auth/login
  if (url.endsWith('/api/auth/login') && method === 'POST') {
    const { email } = body;
    const matchedUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      // Create user on-the-fly for smooth offline demo mode!
      const userId = 'user_' + Math.random().toString(36).substring(2, 9);
      const newUser = { id: userId, email: email.toLowerCase() };
      db.users.push(newUser);

      const profileColors = ['#E50914', '#1f80e0', '#32cd32', '#f5b800', '#7a28cb'];
      const profileNames = ['Primary', 'Friends', 'Family', 'Kids'];
      const defaultProfiles = profileNames.map((name, idx) => ({
        id: 'profile_' + Math.random().toString(36).substring(2, 9),
        userId,
        name,
        avatarColor: profileColors[idx],
        isKids: name === 'Kids',
        myList: []
      }));

      db.profiles.push(...defaultProfiles);
      db.sessionToken = userId;
      saveLocalDB(db);

      return createJSONResponse({
        user: newUser,
        profiles: defaultProfiles
      });
    }

    const userProfiles = db.profiles.filter(p => p.userId === matchedUser.id);
    db.sessionToken = matchedUser.id;
    saveLocalDB(db);

    return createJSONResponse({
      user: matchedUser,
      profiles: userProfiles
    });
  }

  // 4. POST /api/auth/logout
  if (url.endsWith('/api/auth/logout') && method === 'POST') {
    db.sessionToken = null;
    saveLocalDB(db);
    return createJSONResponse({ success: true });
  }

  // 5. GET /api/auth/me
  if (url.endsWith('/api/auth/me')) {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      return createJSONResponse({ error: 'Unauthorized' }, 401);
    }
    const userProfiles = db.profiles.filter(p => p.userId === currentUser.id);
    return createJSONResponse({
      user: currentUser,
      profiles: userProfiles
    });
  }

  // 6. GET /api/profiles
  if (url.endsWith('/api/profiles') && method === 'GET') {
    const currentUser = getLoggedInUser();
    if (!currentUser) return createJSONResponse({ error: 'Unauthorized' }, 401);
    const userProfiles = db.profiles.filter(p => p.userId === currentUser.id);
    return createJSONResponse(userProfiles);
  }

  // 7. POST /api/profiles (Create profile)
  if (url.endsWith('/api/profiles') && method === 'POST') {
    const currentUser = getLoggedInUser();
    if (!currentUser) return createJSONResponse({ error: 'Unauthorized' }, 401);

    const { name, isKids, avatarColor } = body;
    const currentProfiles = db.profiles.filter(p => p.userId === currentUser.id);
    if (currentProfiles.length >= 5) {
      return createJSONResponse({ error: 'Maximum of 5 profiles allowed' }, 400);
    }

    const newProfile = {
      id: 'profile_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      name,
      avatarColor: avatarColor || '#E50914',
      isKids: !!isKids,
      myList: []
    };

    db.profiles.push(newProfile);
    saveLocalDB(db);

    return createJSONResponse(newProfile);
  }

  // 8. DELETE /api/profiles/:id
  const deleteProfileMatch = url.match(/\/api\/profiles\/([^/]+)$/);
  if (deleteProfileMatch && method === 'DELETE') {
    const currentUser = getLoggedInUser();
    if (!currentUser) return createJSONResponse({ error: 'Unauthorized' }, 401);

    const profileId = deleteProfileMatch[1];
    db.profiles = db.profiles.filter(p => !(p.id === profileId && p.userId === currentUser.id));
    saveLocalDB(db);

    return createJSONResponse({ success: true });
  }

  // 9. POST /api/profiles/:id/mylist
  const addListMatch = url.match(/\/api\/profiles\/([^/]+)\/mylist$/);
  if (addListMatch && method === 'POST') {
    const currentUser = getLoggedInUser();
    if (!currentUser) return createJSONResponse({ error: 'Unauthorized' }, 401);

    const profileId = addListMatch[1];
    const { movieId } = body;

    const profile = db.profiles.find(p => p.id === profileId && p.userId === currentUser.id);
    if (!profile) return createJSONResponse({ error: 'Profile not found' }, 404);

    if (!profile.myList.includes(movieId)) {
      profile.myList.push(movieId);
      saveLocalDB(db);
    }

    return createJSONResponse(profile);
  }

  // 10. DELETE /api/profiles/:id/mylist/:movieId
  const removeListMatch = url.match(/\/api\/profiles\/([^/]+)\/mylist\/([^/]+)$/);
  if (removeListMatch && method === 'DELETE') {
    const currentUser = getLoggedInUser();
    if (!currentUser) return createJSONResponse({ error: 'Unauthorized' }, 401);

    const profileId = removeListMatch[1];
    const movieId = removeListMatch[2];

    const profile = db.profiles.find(p => p.id === profileId && p.userId === currentUser.id);
    if (!profile) return createJSONResponse({ error: 'Profile not found' }, 404);

    profile.myList = profile.myList.filter(id => id !== movieId);
    saveLocalDB(db);

    return createJSONResponse(profile);
  }

  return createJSONResponse({ error: 'Not Found' }, 404);
}
