import React from 'react';
import { FileText } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-10 h-10 text-emerald-500" />
        <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
      </div>
      <p className="text-sm text-slate-400 mb-8">Last Updated: August 2026</p>

      <div className="space-y-6 text-base leading-relaxed bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using Curos Investing, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Educational & Informational Purpose Only</h2>
          <p>All content provided on Curos Investing—including news articles, market analysis, AI-generated reports, stock metrics, and financial tools—is strictly for informational and educational purposes only. Nothing on this website constitutes professional financial, investment, legal, or tax advice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Intellectual Property</h2>
          <p>All materials, trademarks, graphics, layout, and software content on Curos Investing are owned by or licensed to Curos Investing and are protected by applicable copyright and trademark law.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
          <p>In no event shall Curos Investing or its authors be liable for any damages (including, without limitation, financial losses, loss of profits, or data) arising out of the use or inability to use the materials on Curos Investing.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. External Links</h2>
          <p>Curos Investing may contain links to external third-party websites. We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with applicable federal and state laws.</p>
        </section>
      </div>
    </div>
  );
};
