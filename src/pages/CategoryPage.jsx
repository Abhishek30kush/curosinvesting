import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ArticleCard } from '../components/ui/ArticleCard';
import { SEO } from '../components/SEO';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Capitalize for display
  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      try {
        if (!db) {
          setLoading(false);
          return;
        }
        const querySnapshot = await getDocs(collection(db, 'articles'));
        let fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter for published status and case-insensitive category match
        fetched = fetched
          .filter(a => a.status === 'published' && a.category?.toLowerCase() === slug?.toLowerCase())
          .sort((a, b) => {
            const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return dateB - dateA;
          });

        setArticles(fetched);
      } catch (error) {
        console.error("Error fetching category articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryArticles();
    }
  }, [slug]);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <SEO 
        title={`${categoryName} News & Market Updates | Curos Investing`}
        description={`Latest financial news, stock market updates, expert research, and insights on ${categoryName.toLowerCase()}.`}
        keywords={`${categoryName}, ${categoryName} news, finance, market analysis, Curos Investing`}
      />
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        <span className="text-emerald-500">{categoryName}</span> News
      </h1>

      <p className="text-slate-400 mb-12 max-w-2xl text-lg">
        The latest updates, deep dives, and expert perspectives on {categoryName.toLowerCase()}.
      </p>

      {loading ? (
        <div className="text-emerald-500 text-center py-20">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          No articles found in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
