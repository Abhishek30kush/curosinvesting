import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { db, storage } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, Save } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export const CreateArticle = () => {
  const location = useLocation();
  const initialData = location.state?.initialData || null;

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState('Markets');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrlExternal, setCoverImageUrlExternal] = useState(initialData?.coverImageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let coverImageUrl = coverImageUrlExternal;
      if (coverImage) {
        const imageRef = ref(storage, `covers/${Date.now()}_${coverImage.name}`);
        const snapshot = await uploadBytes(imageRef, coverImage);
        coverImageUrl = await getDownloadURL(snapshot.ref);
      }
      
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const articleData = {
        title,
        slug,
        category,
        excerpt,
        content,
        author,
        coverImage: coverImageUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: isAdmin ? 'published' : 'pending_review',
        assigneeId: user?.uid || null,
        isAiGenerated: initialData?.isAiGenerated || false
      };

      if (initialData?.id) {
        // Update existing article
        const articleRef = doc(db, 'articles', initialData.id);
        await updateDoc(articleRef, articleData);
      } else {
        // Create new article
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          createdAt: serverTimestamp(),
          views: 0,
          isFeatured: false,
          isAiGenerated: initialData ? true : false // Keep true if it came from AI Assistant
        });
      }
      
      navigate('/admin/articles');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save article: " + error.message + "\n\nIf it's a permission error, please update your Firebase Storage Rules.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          {initialData?.id ? 'Edit Article' : 'Create New Article'}
        </h1>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Markets">Markets</option>
                <option value="Crypto">Crypto</option>
                <option value="Investing">Investing</option>
                <option value="Economy">Economy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Author Name</label>
              <input 
                type="text" 
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-900 transition-colors relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-400">
                {coverImage ? coverImage.name : coverImageUrlExternal ? "AI Image Selected (Click to change)" : "Click or drag image to upload"}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt (Short description)</label>
            <textarea 
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden pb-12">
            <label className="block text-sm font-medium text-slate-700 bg-slate-900 px-4 pt-2 pb-2 text-slate-300 mb-0">Article Content</label>
            <textarea 
              required
              rows={15}
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here... (HTML tags are supported for formatting)"
              className="w-full h-[400px] bg-slate-900 border-none px-4 py-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-b-lg resize-y"
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold py-3 px-8 rounded-lg hover:bg-emerald-400 glow-primary transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Article' : (isAdmin ? 'Publish Article' : 'Submit for Review'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
