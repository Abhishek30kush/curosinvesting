import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FileText, Users, Eye, TrendingUp, Clock, Edit3, Mail } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export const Dashboard = () => {
  const [stats, setStats] = useState({ articles: 0, views: 0, pending: 0, drafts: 0, writers: 0, subscribers: 0 });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!db) return;
        const articlesSnap = await getDocs(collection(db, 'articles'));
        let pending = 0;
        let drafts = 0;
        
        articlesSnap.forEach(doc => {
          if (doc.data().status === 'pending_review') pending++;
          if (doc.data().status === 'draft') drafts++;
        });

        let usersCount = 0;
        let subCount = 0;
        
        try {
          const subSnap = await getDocs(collection(db, 'subscribers'));
          subCount = subSnap.size;
        } catch (e) {
          console.warn("Permission issue fetching subscribers", e);
        }

        if (user?.role && user.role !== 'writer') {
          try {
            const usersSnap = await getDocs(collection(db, 'users'));
            usersCount = usersSnap.size;
          } catch (e) {
            console.warn("Permission denied when fetching users", e);
          }
        }
        
        setStats({ 
          articles: articlesSnap.size, 
          views: articlesSnap.size * 1250,
          pending,
          drafts,
          writers: usersCount,
          subscribers: subCount
        }); 
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Total Articles</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.articles}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Subscribers</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.subscribers}</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Pending Review</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.pending}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Drafts</h3>
            <div className="p-2 bg-slate-500/10 rounded-lg">
              <Edit3 className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.drafts}</p>
        </div>
        
        {user?.role !== 'writer' && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm">Team Members</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.writers}</p>
          </div>
        )}
      </div>


      <div className="glass-card p-8 text-center mt-12">
        <h2 className="text-xl font-bold text-white mb-2">Welcome back, {user?.email}</h2>
        <p className="text-slate-400">You are logged in as <span className="uppercase text-emerald-500 font-bold">{user?.role?.replace('_', ' ')}</span></p>
        <p className="text-slate-500 text-xs mt-4">Your User UID: <span className="font-mono bg-slate-900 p-1 rounded select-all">{user?.uid}</span></p>
      </div>
    </div>
  );
};
