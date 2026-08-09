import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, TrendingUp } from 'lucide-react';

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
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 rounded-full font-medium hover:bg-emerald-500 hover:text-slate-950 glow-primary transition-all duration-300">
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
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-full mt-4 px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 rounded-full font-medium">
                Subscribe
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
