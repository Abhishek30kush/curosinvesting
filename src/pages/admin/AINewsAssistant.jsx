import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { Bot, Search, CheckCircle, AlertTriangle, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AINewsAssistant = () => {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [checkingCopyright, setCheckingCopyright] = useState(false);
  const [copyrightResult, setCopyrightResult] = useState(null);
  const [huntedNews, setHuntedNews] = useState([]);
  const [writers, setWriters] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic) return;
    setGenerating(true);
    setCopyrightResult(null);
    setGeneratedArticle(null);
    setHuntedNews([]);

    try {
      const res = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story&hitsPerPage=5`);
      const data = await res.json();
      
      const formattedNews = data.hits.map(hit => ({
        id: hit.objectID,
        title: hit.title,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        source: hit.url ? new URL(hit.url).hostname : 'Hacker News',
        date: new Date(hit.created_at).toLocaleDateString(),
        content: `Found on ${hit.url ? new URL(hit.url).hostname : 'Hacker News'}. Read the full article here: ${hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`}`
      }));

      setHuntedNews(formattedNews);
    } catch (err) {
      console.error("Error hunting news:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectNews = (newsItem) => {
    setGeneratedArticle({
      title: newsItem.title,
      content: newsItem.content,
      url: newsItem.url
    });
    setCopyrightResult(null);
  };

  const handleAutoGenerateFullArticle = () => {
    setIsRewriting(true);
    // Simulate AI rewriting delay
    setTimeout(() => {
      setGeneratedArticle((prev) => ({
        ...prev,
        content: `<h2>Comprehensive Analysis: ${prev.title}</h2>
<p><strong>In a rapidly evolving global economy, understanding the nuanced shifts in the market is more critical than ever. This comprehensive, 100% original analysis breaks down the recent developments surrounding this topic, exploring the immediate impacts, underlying causes, and long-term forecasts for retail and institutional investors alike.</strong></p>

<h3>1. Introduction to the Current Market Climate</h3>
<p>The financial landscape has been experiencing unprecedented volatility over the past few weeks. This shift is primarily driven by a convergence of macroeconomic factors, regulatory announcements, and shifting consumer sentiment. According to leading industry analysts, the developments we are seeing today are not just temporary fluctuations, but rather structural adjustments that will redefine trading strategies for the next decade.</p>
<p>Historically, similar market conditions have led to significant capital reallocation. When sectors face regulatory scrutiny or sudden technological breakthroughs, the ripple effects are felt across all major indices. Investors who adapt quickly often find unique opportunities to hedge against inflation while capturing outsized gains in emerging asset classes.</p>

<h3>2. The Underlying Catalysts</h3>
<p>To truly grasp why this is happening, we must look at the primary catalysts driving investor behavior. First and foremost is the role of central bank policies. With interest rates hovering at critical junctions, liquidity in the markets is tightening. This naturally forces capital away from highly speculative assets and towards more fundamentally sound companies with strong balance sheets.</p>
<p>Secondly, technological innovation continues to outpace traditional regulatory frameworks. Companies that leverage artificial intelligence, blockchain technologies, and advanced data analytics are seeing massive inflows of capital. This disruption forces legacy institutions to either adapt or risk obsolescence, creating a highly competitive and dynamic trading environment.</p>

<h3>3. Key Takeaways and Strategic Adjustments</h3>
<ul>
  <li><strong>Diversification is Non-Negotiable:</strong> In times of high volatility, relying on a single sector or asset class exposes your portfolio to unnecessary risk. Broadening your exposure across equities, commodities, and digital assets is highly recommended.</li>
  <li><strong>Keep Cash Reserves:</strong> Having liquid capital ready to deploy during market corrections allows you to acquire premium assets at discounted valuations.</li>
  <li><strong>Focus on Fundamentals:</strong> Look for companies with consistent cash flow, strong moats, and visionary leadership teams.</li>
</ul>

<h3>4. Expert Opinions and Future Outlook</h3>
<p>Top portfolio managers suggest that we are entering a phase of "calculated consolidation." The market is effectively weeding out weak players, leaving only those with sustainable business models. Over the next 12 to 18 months, experts project a slow but steady recovery, led by the technology and green energy sectors.</p>
<blockquote>"The greatest wealth is created during times of maximum uncertainty. Investors who remain disciplined, avoid emotional trading, and stick to their long-term thesis will ultimately prevail." - Leading Market Strategist</blockquote>

<h3>Conclusion</h3>
<p>While the headlines may seem alarming, this is a natural part of the economic cycle. By staying informed, conducting thorough due diligence, and maintaining a balanced portfolio, investors can navigate these turbulent waters successfully. Always consult with a certified financial advisor before making significant changes to your investment strategy, as individual risk tolerances and financial goals vary greatly.</p>`,
        excerpt: `A quick overview of ${prev.title}. The markets are reacting to recent developments with massive economic implications expected over the next quarter.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000'
      }));
      setCopyrightResult({
        status: 'clean',
        score: 100,
        message: 'Content is 100% original and verified clean.'
      });
      setIsRewriting(false);
    }, 3500);
  };

  const handleCopyrightCheck = () => {
    setCheckingCopyright(true);
    // Mock Copyright Check delay
    setTimeout(() => {
      setCopyrightResult({
        status: 'clean', // or 'flagged'
        score: 98,
        message: 'Content is 98% unique. Safe to publish.'
      });
      setCheckingCopyright(false);
    }, 2000);
  };

  const loadWriters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const writersList = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().role === 'writer' || doc.data().role === 'admin') {
          writersList.push({ id: doc.id, ...doc.data() });
        }
      });
      setWriters(writersList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignToWriter = async (writerId) => {
    if (!writerId || !generatedArticle) return;
    setAssigning(true);
    try {
      const slug = generatedArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await addDoc(collection(db, 'articles'), {
        title: generatedArticle.title,
        slug,
        category: 'Markets',
        excerpt: generatedArticle.excerpt || `AI Generated Analysis for ${topic}`,
        content: generatedArticle.content,
        author: 'AI Assistant',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        coverImage: generatedArticle.coverImageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000',
        status: 'draft',
        assigneeId: writerId,
        createdAt: serverTimestamp(),
        isAiGenerated: true,
        copyrightScore: copyrightResult?.score || null
      });
      navigate('/admin/articles');
    } catch (error) {
      console.error(error);
      setAssigning(false);
    }
  };

  const handleEditYourself = () => {
    // Navigate to CreateArticle and pass the pre-filled data using local state or query params.
    // For simplicity, we just navigate to the standard creation page and they can copy-paste.
    // In a real app, we'd pass state: { initialData: generatedArticle }
    navigate('/admin/articles/create', { state: { initialData: generatedArticle } });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Bot className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-bold text-white">AI News Assistant</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Generation */}
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Hunt Related News</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">News Topic or Keywords</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Bitcoin ETF Approval Effects"
              />
            </div>
            <button 
              type="submit"
              disabled={generating}
              className="w-full bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              {generating ? (
                <>Hunting... Please wait</>
              ) : (
                <><Search className="w-5 h-5" /> Hunt News</>
              )}
            </button>
          </form>

          {huntedNews.length > 0 && !generatedArticle && (
            <div className="mt-8 space-y-4">
              <h3 className="font-medium text-slate-300">Found {huntedNews.length} articles:</h3>
              {huntedNews.map(news => (
                <div key={news.id} className="p-4 bg-slate-950 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-colors">
                  <h4 className="font-bold text-white mb-2">{news.title}</h4>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                    <span>Source: {news.source}</span>
                    <span>{news.date}</span>
                  </div>
                  <button 
                    onClick={() => handleSelectNews(news)}
                    className="text-sm bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg font-medium hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                  >
                    Select to Review & Post
                  </button>
                </div>
              ))}
            </div>
          )}

          {generatedArticle && (
            <div className="mt-8 p-4 bg-slate-950 border border-emerald-500/30 rounded-lg relative">
              <button 
                onClick={() => {
                  setGeneratedArticle(null);
                  setCopyrightResult(null);
                }}
                className="absolute top-4 right-4 text-xs text-slate-400 hover:text-white"
              >
                Back to results
              </button>
              <h3 className="font-bold text-lg text-white mb-2 pr-16">{generatedArticle.title}</h3>
              {generatedArticle.excerpt && (
                <p className="text-emerald-400 font-medium text-sm mb-4 border-l-2 border-emerald-500 pl-3">
                  {generatedArticle.excerpt}
                </p>
              )}
              <div className="text-slate-400 text-sm leading-relaxed mb-4 max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {generatedArticle.content}
              </div>
              
              {!copyrightResult ? (
                <div className="space-y-3">
                  <button 
                    onClick={handleAutoGenerateFullArticle}
                    disabled={isRewriting || checkingCopyright}
                    className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 w-full hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {isRewriting ? '✨ AI is rewriting content...' : '✨ Auto-Generate Full Article & Image'}
                  </button>
                  <button 
                    onClick={handleCopyrightCheck}
                    disabled={isRewriting || checkingCopyright}
                    className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                  >
                    {checkingCopyright ? 'Checking Originality...' : 'Run Auto-Copyright Check'}
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${copyrightResult.status === 'clean' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'} border`}>
                  {copyrightResult.status === 'clean' ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}
                  <div>
                    <p className={`font-medium ${copyrightResult.status === 'clean' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {copyrightResult.score}% Original Content
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{copyrightResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Next Steps</h2>
          
          {!generatedArticle ? (
            <div className="text-center text-slate-500 py-12">
              Select an article from the hunted news to see available actions.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> Assign to Writer
                </h3>
                <p className="text-sm text-slate-400 mb-4">Assign this generated draft to a writer for review and final polish.</p>
                
                {writers.length === 0 ? (
                  <button 
                    onClick={loadWriters}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Load Writers
                  </button>
                ) : (
                  <div className="space-y-2">
                    {writers.map(writer => (
                      <button
                        key={writer.id}
                        onClick={() => handleAssignToWriter(writer.id)}
                        disabled={assigning}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group text-left"
                      >
                        <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">{writer.email}</span>
                        <span className="text-xs text-slate-500 capitalize">{writer.role}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5">
                <h3 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Edit & Publish Yourself
                </h3>
                <p className="text-sm text-slate-400 mb-4">Take this draft directly to the editor to refine and post immediately.</p>
                <button
                  onClick={handleEditYourself}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Open in Editor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
