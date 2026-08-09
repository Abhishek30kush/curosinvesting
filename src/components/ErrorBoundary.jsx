import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="glass-card max-w-lg p-8 border border-red-500/30 rounded-2xl flex flex-col items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-full text-red-400">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-slate-400 text-sm">
              The application encountered a runtime error. This usually happens if Firebase Environment Variables are missing on Vercel.
            </p>
            
            <div className="bg-slate-900 border border-white/10 p-4 rounded-xl text-left w-full text-xs font-mono text-red-400 overflow-x-auto max-h-32">
              {this.state.error?.toString() || 'Unknown error'}
            </div>

            <div className="text-xs text-slate-400 text-left w-full bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <p className="font-semibold text-emerald-400 mb-1">Fix for Vercel deployment:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Go to Vercel Dashboard → Project Settings → Environment Variables.</li>
                <li>Add all <code className="text-emerald-300">VITE_FIREBASE_*</code> key-value pairs from your <code className="text-emerald-300">.env</code> file.</li>
                <li>Redeploy your application on Vercel.</li>
              </ol>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-2 flex items-center gap-2 bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
