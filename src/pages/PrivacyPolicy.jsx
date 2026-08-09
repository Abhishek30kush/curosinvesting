import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-10 h-10 text-emerald-500" />
        <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
      </div>
      <p className="text-sm text-slate-400 mb-8">Last Updated: August 2026 | Effective for Curos Investing</p>

      <div className="space-y-6 text-base leading-relaxed bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
          <p>Welcome to Curos Investing ("we", "our", or "us"). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you visit our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
          <p>We may collect information in the following ways:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Personal Information:</strong> Email address provided voluntarily via newsletter subscriptions or contact forms.</li>
            <li><strong>Log and Analytics Data:</strong> IP address, browser type, operating system, referring URLs, and pages visited, collected automatically to analyze site performance and traffic patterns.</li>
            <li><strong>Cookies and Web Beacons:</strong> Small data files stored on your device to enhance site navigation, remember user preferences, and serve targeted advertisements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Google AdSense & Third-Party Advertising</h2>
          <p>Curos Investing uses third-party advertising services, including Google AdSense. Google uses cookies (such as the DART cookie) to serve advertisements to visitors based on their visit to our website and other sites on the internet.</p>
          <p className="mt-2">Visitors may opt out of personalized advertising by visiting Google's Ads Settings at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">www.google.com/settings/ads</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. How We Use Your Information</h2>
          <p>We use collected data to maintain and optimize website performance, provide real-time financial market insights, send newsletter updates if requested, prevent fraudulent activity, and deliver relevant advertisements.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Data Security</h2>
          <p>We implement robust industry-standard encryption, firewalls, and security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, please contact us at <span className="text-emerald-400 font-medium">privacy@curosinvesting.com</span>.</p>
        </section>
      </div>
    </div>
  );
};
