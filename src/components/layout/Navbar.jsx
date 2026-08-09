import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, TrendingUp, Mail, CheckCircle } from 'lucide-react';
import { db, hasValidFirebaseConfig } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const MOCK_TICKERS = [
  { symbol: 'SENSEX', price: '73,500.20', change: '+1.2%', isUp: true },
  { symbol: 'NIFTY', price: '22,400.50', change: '+0.8%', isUp: true },
  { symbol: 'GOLD', price: '₹62,300', change: '-0.3%', isUp: false },
  { symbol: 'BTC', price: '$65,420', change: '+5.4%', isUp: true },
  { symbol: 'AAPL', price: '$175.50', change: '+1.1%', isUp: true },
  { symbol: 'RELIANCE', price: '₹2,950', change: '-0.5%', isUp: false },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tickers, setTickers] = useState(MOCK_TICKERS);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search articles dynamically from Firestore
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        if (db) {
          const { collection: col, getDocs: gDocs } = await import('firebase/firestore');
          const snap = await gDocs(col(db, 'articles'));
          const results = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            if (
              data.status === 'published' &&
              (data.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               data.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               data.category?.toLowerCase().includes(searchQuery.toLowerCase()))
            ) {
              results.push({ id: docSnap.id, ...data });
            }
          });
          setSearchResults(results.slice(0, 5));
        }
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => ({
        ...t,
        price: t.price,
        isUp: Math.random() > 0.5
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  const handleModalSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail) return;
    setIsSubmitting(true);
    const cleanEmail = subEmail.toLowerCase().trim();

    try {
      // 1. Sync to LocalStorage
      try {
        const localSubs = JSON.parse(localStorage.getItem('curos_subscribers') || '[]');
        if (!localSubs.some(s => s.email === cleanEmail)) {
          localSubs.push({
            id: 'local_' + Date.now(),
            email: cleanEmail,
            status: 'active',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
          localStorage.setItem('curos_subscribers', JSON.stringify(localSubs));
        }
      } catch (e) {
        console.warn("LocalStorage save error", e);
      }

      // 2. Sync to Firestore DB
      if (db && hasValidFirebaseConfig) {
        const docId = cleanEmail.replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, 'subscribers', docId), {
          email: cleanEmail,
          status: 'active',
          subscribedAt: serverTimestamp(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }

      setIsSubscribed(true);
      setSubEmail('');
    } catch (err) {
      console.error("Newsletter error:", err);
      setIsSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <header className="fixed top-0 w-full z-50">
      {/* Ticker Bar */}
      <div className="bg-slate-950 border-b border-white/5 py-1.5 overflow-hidden flex whitespace-nowrap relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="flex animate-scroll hover:[animation-play-state:paused] gap-8 px-4 items-center min-w-full">
          {[...tickers, ...tickers, ...tickers].map((ticker, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium">
              <span className="text-slate-400">{ticker.symbol}</span>
              <span className="text-slate-200">{ticker.price}</span>
              <span className={ticker.isUp ? 'text-emerald-500' : 'text-red-500'}>
                {ticker.isUp ? '▲' : '▼'} {ticker.change}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      </div>

      {/* Main Navbar */}
      <nav className="glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
                <span className="text-2xl font-bold tracking-tight text-gradient">
                  Curos Investing
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link to="/category/markets" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Markets</Link>
              <Link to="/category/crypto" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Crypto</Link>
              <Link to="/category/investing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Investing</Link>
              <Link to="/category/economy" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Economy</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-slate-900 border border-white/10 px-3 py-1.5 rounded-full"
                title="Search Articles"
              >
                <Search className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-400">Search...</span>
              </button>
              <button 
                onClick={() => setShowSubscribeModal(true)}
                className="px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 rounded-full font-medium hover:bg-emerald-500 hover:text-slate-950 glow-primary transition-all duration-300 text-sm"
              >
                Subscribe
              </button>
            </div>


            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-400 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-white/5">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white bg-white/5 rounded-md">Home</Link>
              <Link to="/category/markets" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md">Markets</Link>
              <Link to="/category/crypto" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md">Crypto</Link>
              <Link to="/category/investing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md">Investing</Link>
              <Link to="/category/economy" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md">Economy</Link>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowSubscribeModal(true);
                }} 
                className="w-full mt-4 px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 rounded-full font-medium"
              >
                Subscribe
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => {
                setShowSubscribeModal(false);
                setIsSubscribed(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubscribed ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">You're Subscribed!</h3>
                <p className="text-slate-400 text-sm">Thank you for subscribing to Curos Investing Newsletter. You'll receive real-time financial market updates.</p>
                <button
                  onClick={() => {
                    setShowSubscribeModal(false);
                    setIsSubscribed(false);
                  }}
                  className="mt-6 bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-400 text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Subscribe to Newsletter</h3>
                    <p className="text-xs text-slate-400">Daily market signals & expert analysis</p>
                  </div>
                </div>

                <form onSubmit={handleModalSubscribe} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-emerald-400 glow-primary transition-all text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Join Newsletter'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, topic, or keyword..."
                  className="bg-transparent border-none text-white text-base focus:outline-none w-full placeholder-slate-500"
                />
              </div>
              <button 
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {isSearching ? (
                <div className="text-center py-8 text-emerald-400 text-sm">Searching Curos Investing articles...</div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No articles found matching "{searchQuery}".</div>
              ) : (
                searchResults.map((res) => (
                  <Link
                    key={res.id}
                    to={`/article/${res.slug}`}
                    onClick={() => {
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }}
                    className="block p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                  >
                    <span className="text-xs uppercase font-bold text-emerald-400 mb-1 block">{res.category}</span>
                    <h4 className="text-white font-semibold text-sm line-clamp-1">{res.title}</h4>
                    <p className="text-slate-400 text-xs line-clamp-1 mt-1">{res.excerpt}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


