import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-8 w-8 text-emerald-500" />
              <span className="text-2xl font-bold tracking-tight text-white">
                Curos Investing
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Your premium destination for real-time market insights, expert analysis, and comprehensive investing news.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><FaTwitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><FaLinkedin className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><FaFacebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><FaInstagram className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company & Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-emerald-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-emerald-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/disclaimer" className="text-slate-400 hover:text-emerald-500 transition-colors">Disclaimer</Link></li>
              <li><Link to="/privacy-policy" className="text-slate-400 hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-400 hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-slate-400 mb-4 text-sm">Get the latest market updates directly in your inbox.</p>
            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg">
                Thanks for subscribing to Curos Investing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button type="submit" className="bg-emerald-500 text-slate-950 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors glow-primary">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Curos Investing. All rights reserved. Financial news & market analysis.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="text-slate-500 hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

