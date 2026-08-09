import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Calculators = () => {
  const [activeTab, setActiveTab] = useState('sip');

  // SIP Calculator State
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [expectedRate, setExpectedRate] = useState(12);
  const [investmentYears, setInvestmentYears] = useState(10);

  // Crypto ROI Calculator State
  const [buyPrice, setBuyPrice] = useState(60000);
  const [sellPrice, setSellPrice] = useState(90000);
  const [investedAmount, setInvestedAmount] = useState(50000);

  // SIP Calculation Logic
  const totalMonths = investmentYears * 12;
  const monthlyRate = expectedRate / 12 / 100;
  const totalInvestedSip = monthlyInvest * totalMonths;
  const estimatedReturnsSip = Math.round(
    monthlyInvest * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate) - totalInvestedSip
  );
  const totalValueSip = totalInvestedSip + Math.max(0, estimatedReturnsSip);

  // Crypto Calculation Logic
  const coinsBought = buyPrice > 0 ? investedAmount / buyPrice : 0;
  const currentTotalValue = coinsBought * sellPrice;
  const cryptoProfit = currentTotalValue - investedAmount;
  const cryptoRoiPercent = investedAmount > 0 ? ((cryptoProfit / investedAmount) * 100).toFixed(2) : 0;

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen text-slate-300">
      <SEO 
        title="Financial & Crypto Calculators | Curos Investing"
        description="Free online SIP Return Calculator and Crypto ROI Calculator to plan your investments and calculate compound returns."
        keywords="SIP calculator, crypto ROI calculator, investment calculator, compound interest, Curos Investing"
      />

      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Investment & Crypto Calculators</h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Plan your financial goals, calculate compound SIP growth, and estimate crypto investment returns in real time.
        </p>
      </div>

      {/* Calculator Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab('sip')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'sip'
              ? 'bg-emerald-500 text-slate-950 glow-primary'
              : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> SIP Return Calculator
        </button>
        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'crypto'
              ? 'bg-emerald-500 text-slate-950 glow-primary'
              : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Crypto ROI & Profit Calculator
        </button>
      </div>

      {/* SIP Calculator Tab */}
      {activeTab === 'sip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-card p-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="font-semibold text-white">Monthly Investment</label>
                <span className="text-emerald-400 font-bold">₹{monthlyInvest.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvest}
                onChange={(e) => setMonthlyInvest(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="font-semibold text-white">Expected Return Rate (p.a)</label>
                <span className="text-emerald-400 font-bold">{expectedRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedRate}
                onChange={(e) => setExpectedRate(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="font-semibold text-white">Time Horizon (Years)</label>
                <span className="text-emerald-400 font-bold">{investmentYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={investmentYears}
                onChange={(e) => setInvestmentYears(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" /> SIP Projection Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Total Invested Amount:</span>
                <span className="text-white font-bold">₹{totalInvestedSip.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Estimated Wealth Gain:</span>
                <span className="text-emerald-400 font-bold">₹{estimatedReturnsSip.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-200 font-bold text-base">Expected Total Maturity Value:</span>
                <span className="text-emerald-400 font-extrabold text-xl">₹{totalValueSip.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crypto ROI Calculator Tab */}
      {activeTab === 'crypto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-card p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Capital Invested ($)</label>
              <input
                type="number"
                value={investedAmount}
                onChange={(e) => setInvestedAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset Entry Purchase Price ($)</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expected Exit / Sell Price ($)</label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" /> ROI & Profit Projections
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Coins / Tokens Units Acquired:</span>
                <span className="text-white font-mono font-bold">{coinsBought.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Estimated Total Portfolio Value:</span>
                <span className="text-white font-bold">${Math.round(currentTotalValue).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Estimated Net Profit:</span>
                <span className={`font-bold ${cryptoProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {cryptoProfit >= 0 ? '+' : ''}${Math.round(cryptoProfit).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-200 font-bold text-base">Total ROI Percentage:</span>
                <span className={`font-extrabold text-xl ${cryptoRoiPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {cryptoRoiPercent >= 0 ? '+' : ''}{cryptoRoiPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
