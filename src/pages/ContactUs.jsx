import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-slate-300">
      <SEO 
        title="Contact Us | Curos Investing Editorial Team"
        description="Get in touch with the Curos Investing editorial research team for press inquiries, feedback, or partnership proposals."
      />
      <div className="text-center mb-12">

        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">Contact Us</h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">Have a press inquiry, partnership proposal, or feedback? Get in touch with our editorial team.</p>
      </div>

      <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl max-w-2xl mx-auto">
        {submitted ? (
          <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
            <p className="text-slate-400 text-sm">Thank you for contacting Curos Investing. Our team will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Editorial Inquiry / Feedback"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Your message details..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 text-slate-950 font-bold py-3 px-6 rounded-lg hover:bg-emerald-400 glow-primary transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
