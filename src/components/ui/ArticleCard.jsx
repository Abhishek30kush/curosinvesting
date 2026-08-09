import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp } from 'lucide-react';

export const ArticleCard = ({ article, featured = false }) => {
  const formattedDate = article.date || 
    (article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 
    (article.createdAt?.seconds ? new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'));

  return (
    <Link to={`/article/${article.slug}`} className="group block h-full">
      <article className={`glass-card h-full overflow-hidden flex flex-col ${featured ? 'md:flex-row md:col-span-2 lg:col-span-3' : ''}`}>
        <div className={`relative overflow-hidden ${featured ? 'md:w-2/3 md:h-[400px]' : 'h-48'}`}>
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
              {article.category}
            </span>
          </div>
        </div>
        
        <div className={`p-6 flex flex-col flex-grow ${featured ? 'md:w-1/3 justify-center' : ''}`}>
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
            <span>{article.author || 'Editorial Team'}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
          
          <h3 className={`font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors ${featured ? 'text-2xl md:text-3xl leading-tight' : 'text-lg leading-snug'}`}>
            {article.title}
          </h3>
          
          <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
            {article.excerpt}
          </p>
          
          <div className="flex items-center text-emerald-500 text-sm font-semibold mt-auto group-hover:translate-x-2 transition-transform">
            Read full story <TrendingUp className="w-4 h-4 ml-1" />
          </div>
        </div>
      </article>
    </Link>
  );
};
