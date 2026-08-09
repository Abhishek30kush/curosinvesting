import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Edit, Trash2, Plus, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'articles');
      if (user?.role === 'writer') {
        q = query(collection(db, 'articles'), where('assigneeId', '==', user.uid));
      }
      
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(fetched);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        fetchArticles();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const getArticleDate = (article) => {
    if (article.date) return article.date;
    if (article.createdAt?.toDate) return article.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (article.createdAt?.seconds) return new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return 'N/A';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Articles</h1>
        <Link 
          to="/admin/articles/create"
          className="flex items-center gap-2 bg-emerald-500 text-slate-950 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-400 glow-primary transition-all"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/80 text-slate-300 uppercase font-semibold border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center">No articles found.</td></tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{article.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-xs">{article.category || 'General'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        article.status === 'published' ? 'text-emerald-400' :
                        article.status === 'pending_review' ? 'text-amber-400' :
                        'text-slate-400'
                      }`}>
                        {article.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {(article.status || 'draft').replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getArticleDate(article)}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link 
                        to="/admin/articles/create" 
                        state={{ initialData: article }}
                        className="text-blue-400 hover:text-blue-300 transition-colors inline-block"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                      <button onClick={() => handleDelete(article.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
