import React, { useEffect, useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, BarChart3, Bitcoin, Globe, Briefcase } from 'lucide-react';
import { ArticleCard } from '../components/ui/ArticleCard';
import { db, hasValidFirebaseConfig } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';


const MOCK_CATEGORIES = [
  { name: 'Markets', icon: BarChart3, slug: 'markets', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Crypto', icon: Bitcoin, slug: 'crypto', color: 'from-amber-400 to-amber-600' },
  { name: 'Economy', icon: Globe, slug: 'economy', color: 'from-blue-400 to-blue-600' },
  { name: 'Investing', icon: Briefcase, slug: 'investing', color: 'from-purple-400 to-purple-600' },
];

const MOCK_ARTICLES = [
  {
    slug: 'fed-rate-decision-impact',
    title: 'Federal Reserve Maintains Interest Rates: What It Means for Your Portfolio',
    excerpt: 'The central bank opted to hold steady on interest rates as inflation cools but remains above target. Markets reacted positively with tech stocks leading the rally.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    category: 'Economy',
    author: 'Sarah Jenkins',
    date: '2 hours ago',
    isFeatured: true
  },
  {
    slug: 'bitcoin-halving-analysis',
    title: 'Bitcoin Surges Past $65k Ahead of Upcoming Halving Event',
    excerpt: 'Institutional inflows continue to drive cryptocurrency markets higher as retail investors FOMO back in.',
    coverImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop',
    category: 'Crypto',
    author: 'Alex Chen',
    date: '5 hours ago',
    isFeatured: false
  },
  {
    slug: 'ai-stocks-rally',
    title: 'AI Sector Rally Spreads Beyond Magnificent Seven',
    excerpt: 'Mid-cap enterprise software companies are starting to see the benefits of artificial intelligence integration.',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop',
    category: 'Markets',
    author: 'Michael Rossi',
    date: '1 day ago',
    isFeatured: false
  },
  {
    slug: 'dividend-investing-guide',
    title: 'Top 5 Dividend Aristocrats for Income Investors in 2024',
    excerpt: 'A comprehensive look at stable companies that have consistently grown their payouts for over 25 years.',
    coverImage: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2070&auto=format&fit=crop',
    category: 'Investing',
    author: 'David Wilson',
    date: '1 day ago',
    isFeatured: false
  }
];

export const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!db || !hasValidFirebaseConfig) {
        setLoading(false);
        return;
      }

      try {
        // Fetching without composite query to bypass Firestore Index requirement
        const querySnapshot = await getDocs(collection(db, 'articles'));
        let fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter and sort locally
        fetched = fetched
          .filter(a => a.status === 'published')
          .sort((a, b) => {
             const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
             const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
             return dateB - dateA;
          });
          
        if (fetched.length > 0) {
          setArticles(fetched);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);


  // Use the first real article as featured, and remaining articles in the latest section
  const featuredArticle = articles.length > 0 ? articles[0] : MOCK_ARTICLES[0];
  const latestArticles = articles.length > 1 
    ? articles.slice(1) 
    : (articles.length === 1 
        ? MOCK_ARTICLES.filter(m => m.slug !== featuredArticle.slug) 
        : MOCK_ARTICLES.slice(1));

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="text-center mb-16 relative z-10 pt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Navigate the markets with <br/>
            <span className="text-gradient">precision & clarity.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Premium financial news, expert analysis, and actionable insights to help you build and protect your wealth.
          </p>
          {errorMsg && (
            <div className="mt-8 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg max-w-2xl mx-auto">
              <strong>Database Error:</strong> {errorMsg} <br/>
              (Make sure Firestore Security Rules allow public read access to 'articles')
            </div>
          )}
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <ArticleCard article={featuredArticle} featured={true} />
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          Explore Topics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_CATEGORIES.map((category) => (
            <div key={category.name} className="glass-card p-6 flex flex-col items-center justify-center gap-4 group cursor-pointer">
              <div className={`p-4 rounded-full bg-gradient-to-br ${category.color} bg-opacity-10 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <span className="font-semibold text-slate-200 group-hover:text-white">{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          Latest News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id || article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Why Curos */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 pt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Curos Investing?</h2>
          <p className="text-slate-400">The premium edge for modern investors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Updates</h3>
            <p className="text-slate-400">Lightning-fast market news and price action, keeping you ahead of the curve.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Expert Analysis</h3>
            <p className="text-slate-400">Deep dives into market trends from seasoned Wall Street veterans.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 mx-auto bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Learn & Grow</h3>
            <p className="text-slate-400">Educational resources to build your foundational investing knowledge.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
