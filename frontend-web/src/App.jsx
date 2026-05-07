import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Heart, 
  Plus, 
  History, 
  Send, 
  Smile, 
  Frown, 
  Meh, 
  Zap, 
  Moon, 
  Sun,
  LayoutDashboard,
  LogOut,
  Calendar,
  MessageSquare,
  X,
  PieChart as PieIcon,
  TrendingUp,
  BarChart3,
  Menu,
  Languages
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/entries';

const EMOTION_THEMES = {
  "Very Sad/Angry": { color: '#ef4444', icon: <Zap size={20} />, label: { es: 'Intenso/Enojado', en: 'Intense/Angry', pt: 'Intenso/Bravo' }, bg: 'rgba(239, 68, 68, 0.15)' },
  "Sad": { color: '#3b82f6', icon: <Frown size={20} />, label: { es: 'Triste', en: 'Sad', pt: 'Triste' }, bg: 'rgba(59, 130, 246, 0.15)' },
  "Neutral": { color: '#8b5cf6', icon: <Meh size={20} />, label: { es: 'Neutral', en: 'Neutral', pt: 'Neutro' }, bg: 'rgba(139, 92, 246, 0.1)' },
  "Happy": { color: '#10b981', icon: <Smile size={20} />, label: { es: 'Feliz', en: 'Happy', pt: 'Feliz' }, bg: 'rgba(16, 185, 129, 0.15)' },
  "Very Happy": { color: '#f59e0b', icon: <Heart size={20} />, label: { es: 'Muy Feliz', en: 'Very Happy', pt: 'Muito Feliz' }, bg: 'rgba(245, 158, 11, 0.15)' }
};


const TRANSLATIONS = {
  es: {
    welcome: "Hola, ¿Cómo te sientes hoy?",
    subtitle: "Registra tus pensamientos y descubre tus patrones emocionales.",
    placeholder: "Escribe aquí lo que tienes en mente...",
    register: "Registrar",
    analyzing: "Analizando...",
    recentEntries: "Tus Entradas Recientes",
    emptyState: "Aún no hay entradas. ¡Empieza a escribir!",
    dashboard: "Dashboard",
    history: "Historial",
    calendar: "Calendario",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",
    statsSummary: "Tu Resumen Emocional",
    avgMood: "Ánimo Promedio",
    totalEntries: "Total Entradas",
    moodTrend: "Tendencia de Ánimo",
    emotionDist: "Distribución de Emociones",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta entrada?",
    charCount: "caracteres",
    noEntries: "Aún no hay entradas. ¡Empieza a escribir!"
  },
  en: {
    welcome: "Hello, How are you feeling today?",
    subtitle: "Log your thoughts and discover your emotional patterns.",
    placeholder: "Write what's on your mind here...",
    register: "Register",
    analyzing: "Analyzing...",
    recentEntries: "Your Recent Entries",
    emptyState: "No entries yet. Start writing!",
    dashboard: "Dashboard",
    history: "History",
    calendar: "Calendar",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    statsSummary: "Your Emotional Summary",
    avgMood: "Average Mood",
    totalEntries: "Total Entries",
    moodTrend: "Mood Trend",
    emotionDist: "Emotion Distribution",
    deleteConfirm: "Are you sure you want to delete this entry?",
    charCount: "characters",
    noEntries: "No entries yet. Start writing!"
  },
  pt: {
    welcome: "Olá, Como você está se sentindo hoje?",
    subtitle: "Registre seus pensamentos e descubra seus padrões emocionais.",
    placeholder: "Escreva o que está em sua mente aqui...",
    register: "Registrar",
    analyzing: "Analisando...",
    recentEntries: "Suas Entradas Recentes",
    emptyState: "Nenhuma entrada ainda. Comece a escrever!",
    dashboard: "Dashboard",
    history: "Histórico",
    calendar: "Calendário",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",
    statsSummary: "Seu Resumo Emocional",
    avgMood: "Humor Médio",
    totalEntries: "Total de Entradas",
    moodTrend: "Tendência de Humor",
    emotionDist: "Distribuição de Emoções",
    deleteConfirm: "Tem certeza que deseja excluir esta entrada?",
    charCount: "caracteres",
    noEntries: "Nenhuma entrada ainda. Comece a escrever!"
  }
};

function App() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('es');

  // Sync theme with document for global CSS support
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const t = (key) => TRANSLATIONS[language][key] || key;

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await axios.post(API_BASE_URL, { content });
      setContent('');
      fetchEntries();
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getChartData = () => {
    return [...entries].reverse().map(e => ({
      date: new Date(e.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      score: entryToScore(e.primary_emotion),
      value: e.emotion_score
    }));
  };

  const entryToScore = (label) => {
    const scores = { "Very Happy": 5, "Happy": 4, "Neutral": 3, "Sad": 2, "Very Sad/Angry": 1 };
    return scores[label] || 3;
  };

  const getStats = () => {
    if (entries.length === 0) return { avg: 0, total: 0, distribution: [] };
    
    const sum = entries.reduce((acc, curr) => acc + curr.emotion_score, 0);
    const avg = (sum / entries.length) * 10;
    
    const dist = entries.reduce((acc, curr) => {
      acc[curr.primary_emotion] = (acc[curr.primary_emotion] || 0) + 1;
      return acc;
    }, {});

    const distributionData = Object.keys(EMOTION_THEMES).map(key => ({
      name: EMOTION_THEMES[key].label[language],
      count: dist[key] || 0,
      color: EMOTION_THEMES[key].color
    }));

    return { avg: avg.toFixed(1), total: entries.length, distribution: distributionData };
  };

  const stats = getStats();
  const chartData = getChartData();

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Dynamic Background Animation */}
      <div className="bg-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Popup Backdrop */}
      <div className={`mobile-overlay ${isMenuOpen ? 'visible' : ''}`} onClick={() => setIsMenuOpen(false)}></div>


      <aside className={`sidebar glass ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Heart fill="var(--accent-secondary)" color="var(--accent-secondary)" />
            <span>EmoteDay</span>
          </div>
          <button className="mobile-close" onClick={() => setIsMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav>
          <button className="nav-item active" onClick={() => setIsMenuOpen(false)}>
            <LayoutDashboard size={20} />
            <span>{t('dashboard')}</span>
          </button>
          <button className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <History size={20} />
            <span>{t('history')}</span>
          </button>
          <button className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <Calendar size={20} />
            <span>{t('calendar')}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="lang-switcher">
            <button className={`lang-btn ${language === 'es' ? 'active' : ''}`} onClick={() => setLanguage('es')}>ES</button>
            <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
            <button className={`lang-btn ${language === 'pt' ? 'active' : ''}`} onClick={() => setLanguage('pt')}>PT</button>
          </div>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? t('darkMode') : t('lightMode')}</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="menu-trigger" onClick={() => setIsMenuOpen(true)} title="Open Menu">
              <Menu size={24} />
            </button>

            <div className="welcome">
              <h2>{t('welcome')}</h2>
              <p>{t('subtitle')}</p>
            </div>
          </div>
        </header>

        <section className="entry-section">
          <form onSubmit={handleSubmit} className="entry-form glass">
            <textarea
              placeholder={t('placeholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
            <div className="form-footer">
              <span className="char-count">{content.length} {t('charCount')}</span>
              <button type="submit" disabled={loading || !content.trim()} className="submit-btn highlight">
                {loading ? t('analyzing') : <><Send size={18} /><span>{t('register')}</span></>}
              </button>
            </div>
          </form>
        </section>

        <section className="feed-section">
          <div className="feed-header">
            <h3>{t('recentEntries')}</h3>
          </div>
          <div className="entries-grid">
            {entries.length === 0 ? (
              <div className="empty-state glass">
                <MessageSquare size={48} opacity={0.3} />
                <p>{t('emptyState')}</p>
              </div>
            ) : (
              entries.map((entry) => {
                const theme = EMOTION_THEMES[entry.primary_emotion] || EMOTION_THEMES["Neutral"];
                return (
                  <div key={entry.id} className="entry-card glass animate-fade-in">
                    <div className="entry-header">
                      <div className="header-left">
                        <span className="date">{formatDate(entry.created_at)}</span>
                        <div className="emotion-badge" style={{ backgroundColor: theme.bg, color: theme.color }}>
                          {theme.icon}
                          <span>{theme.label[language]}</span>
                        </div>
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(entry.id)}
                        title="Eliminar entrada"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="content">{entry.content}</p>
                    <div className="entry-footer">
                      <div className="score-viz">
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ 
                              width: `${entry.emotion_score * 100}%`,
                              backgroundColor: theme.color
                            }} 
                          />
                        </div>
                        <span className="score-text">{(entry.emotion_score * 10).toFixed(1)}/10</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {entries.length > 0 && (
          <section className="stats-section animate-fade-in">
            <div className="section-header">
              <h3>{t('statsSummary')}</h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-header">
                  <TrendingUp size={20} color="var(--accent-primary)" />
                  <span>{t('avgMood')}</span>
                </div>
                <div className="stat-value">{stats.avg}<span>/10</span></div>
              </div>
              <div className="stat-card glass">
                <div className="stat-header">
                  <MessageSquare size={20} color="var(--accent-secondary)" />
                  <span>{t('totalEntries')}</span>
                </div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-box glass">
                <h4>{t('moodTrend')}</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--text-secondary)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: 'var(--text-secondary)' }}
                      />
                      <YAxis domain={[0, 1]} hide />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-secondary)', 
                          borderRadius: '12px', 
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-primary)'
                        }} 
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />

                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-box glass">
                <h4>{t('emotionDist')}</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.distribution}>
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--text-secondary)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: 'var(--text-secondary)' }}
                      />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-secondary)', 
                          borderRadius: '12px', 
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-primary)'
                        }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />

                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {stats.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
