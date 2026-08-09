import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Clock, User, ChevronLeft, ShieldCheck, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';

export const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        if (!db) {
          setLoading(false);
          return;
        }
        const q = query(collection(db, 'articles'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setArticle({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24 text-emerald-500">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-white">
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <Link to="/" className="text-emerald-500 hover:text-emerald-400">Return to Home</Link>
      </div>
    );
  }

  // Calculate word count & reading time
  const plainText = article.content ? article.content.replace(/<[^>]+>/g, '') : '';
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <SEO 
        title={`${article.title} | Curos Investing`}
        description={article.excerpt || `${article.title} - Read the full financial analysis, market implications, and strategic takeaways on Curos Investing.`}
        keywords={`${article.category}, ${article.title.toLowerCase().split(' ').slice(0, 5).join(', ')}, Curos Investing`}
        image={article.coverImage}
        type="article"
        articleData={article}
      />
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-8 text-sm">
        <ChevronLeft className="w-4 h-4" /> Back to Home
      </Link>

      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            {wordCount > 0 ? `${wordCount} words` : 'Long-form Analysis'}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            {readingTime} min read
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {article.title}
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed font-light">
          {article.excerpt}
        </p>
        
        {/* EEAT Author Card */}
        <div className="flex items-center justify-between border-y border-white/10 py-4 mb-8 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">{article.author || 'Curos Research Team'}</p>
              <p className="text-xs text-slate-400">Verified Financial Research Analyst</p>
            </div>
          </div>
          <div className="text-slate-400 text-xs">
            <span>Published {article.date}</span>
          </div>
        </div>
      </div>

      {/* AdSense Placement: Below Header Banner */}
      <div className="my-8 p-4 bg-slate-900/60 border border-white/5 rounded-xl text-center text-xs text-slate-500">
        <span className="block text-[10px] tracking-widest text-slate-600 uppercase mb-1">Advertisement</span>
        {/* Google AdSense Unit Container */}
        <div className="min-h-[90px] flex items-center justify-center border border-dashed border-white/10 rounded-lg text-slate-400">
          AdSense Leaderboard Placement (Responsive Banner Ad)
        </div>
      </div>

      {article.coverImage && (
        <div className="w-full h-[350px] md:h-[480px] rounded-2xl overflow-hidden mb-12 shadow-[0_0_30px_rgba(16,185,129,0.1)] border border-white/5">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Render HTML content securely using dangerouslySetInnerHTML */}
      <div 
        className="prose prose-invert prose-emerald max-w-none prose-lg
                   prose-headings:font-bold prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* AdSense Placement: In-Article Content Footer Ad */}
      <div className="my-12 p-6 bg-slate-900/80 border border-white/10 rounded-2xl text-center text-xs text-slate-500">
        <span className="block text-[10px] tracking-widest text-slate-600 uppercase mb-2">Sponsored Content</span>
        <div className="min-h-[250px] flex items-center justify-center border border-dashed border-white/10 rounded-xl text-slate-400">
          AdSense Display Rectangle (Inline Article Ad Unit)
        </div>
      </div>

      {/* Financial Disclaimer Box */}
      <div className="mt-12 p-6 bg-slate-900/40 border border-amber-500/20 rounded-2xl text-xs text-slate-400">
        <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-2 text-sm">
          <span>⚖️</span> Financial Disclosure & Editorial Policy
        </h4>
        <p className="leading-relaxed">
          The financial news and analysis published on Curos Investing is provided solely for educational and informational purposes. It does not constitute financial, investment, or trading advice. Past performance is not indicative of future market returns. Always consult with a licensed financial advisor before making capital investment decisions.
        </p>
      </div>
    </article>
  );
};

