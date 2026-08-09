import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Clock, User, ChevronLeft } from 'lucide-react';

export const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
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

  return (
    <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-8">
        <ChevronLeft className="w-4 h-4" /> Back to Home
      </Link>
      
      <div className="mb-8">
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-sm font-semibold rounded-full border border-emerald-500/20 mb-6 inline-block">
          {article.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {article.title}
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          {article.excerpt}
        </p>
        
        <div className="flex items-center gap-6 border-y border-white/10 py-4 mb-8">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-5 h-5" />
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      {article.coverImage && (
        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Render HTML content from ReactQuill securely using dangerouslySetInnerHTML */}
      <div 
        className="prose prose-invert prose-emerald max-w-none prose-lg
                   prose-headings:font-bold prose-a:text-emerald-500 hover:prose-a:text-emerald-400 text-slate-300"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
};
