import React from 'react';
import { TrendingUp, ShieldCheck, Award, Globe } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-slate-300">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">About Curos Investing</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Empowering modern investors with real-time financial intelligence, deep-dive market analytics, and institutional-grade news.</p>
      </div>

      <div className="space-y-8 bg-slate-900/50 border border-white/5 p-8 rounded-2xl leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p>Curos Investing was founded with a singular purpose: to level the playing field for retail and institutional investors alike. Financial markets move at lightning speed, and access to accurate, structured, and unbiased news is the foundation of smart wealth creation.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 bg-slate-950 border border-white/10 rounded-xl text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-2">Uncompromising EEAT</h3>
            <p className="text-xs text-slate-400">Verified financial analysis backed by data-driven market indicators.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-white/10 rounded-xl text-center">
            <Award className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-2">AI & Human Expertise</h3>
            <p className="text-xs text-slate-400">Blending cutting-edge artificial intelligence with experienced market research.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-white/10 rounded-xl text-center">
            <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-2">Global Coverage</h3>
            <p className="text-xs text-slate-400">Tracking US equities, crypto assets, central banks, and global macroeconomic trends.</p>
          </div>
        </section>

        <section className="pt-4">
          <h2 className="text-2xl font-bold text-white mb-3">Editorial Standards</h2>
          <p>Every article published on Curos Investing undergoes rigorous fact-checking and originality verification. We strictly adhere to Google’s E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) guidelines to ensure our readers receive only high-value, actionable financial news.</p>
        </section>
      </div>
    </div>
  );
};
