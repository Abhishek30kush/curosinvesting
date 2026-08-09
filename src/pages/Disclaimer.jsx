import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Disclaimer = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-slate-300">
      <SEO 
        title="Financial Disclaimer | Curos Investing"
        description="Important financial risk disclosures, investment warning, and legal statements for Curos Investing readers."
      />
      <div className="flex items-center gap-3 mb-6">

        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <h1 className="text-4xl font-extrabold text-white">Financial Disclaimer</h1>
      </div>
      <p className="text-sm text-slate-400 mb-8">Important Risk Warning & Disclosure</p>

      <div className="space-y-6 text-base leading-relaxed bg-slate-900/50 border border-amber-500/20 p-8 rounded-2xl">
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-semibold mb-6">
          ⚠️ Please read this disclaimer carefully before using Curos Investing.
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. No Investment Advice</h2>
          <p>The information contained on Curos Investing is provided solely for general informational and educational purposes. No material published on this site constitutes a recommendation, endorsement, or financial advice to buy, sell, or hold any security, cryptocurrency, stock, option, or financial asset.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. High Market Risk</h2>
          <p>Financial trading and investing—including stocks, foreign exchange (Forex), commodities, and cryptocurrencies—involves substantial risk of capital loss. Market prices can fluctuate rapidly and unexpectedly. You should never invest money that you cannot afford to lose completely.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Independent Due Diligence</h2>
          <p>Before executing any investment or financial decision, you should conduct your own thorough research, consult with a qualified, licensed financial advisor, and assess your personal risk tolerance.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Accuracy of Information</h2>
          <p>While we endeavor to keep the information up to date and correct, market data can change instantaneously. Curos Investing makes no representations or warranties of any kind regarding the completeness, accuracy, or reliability of any market data or news analysis.</p>
        </section>
      </div>
    </div>
  );
};
