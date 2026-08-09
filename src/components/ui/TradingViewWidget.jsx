import React, { useEffect, useRef } from 'react';

export const TradingViewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "450",
      plotLineColorGrowing: "rgba(16, 185, 129, 1)",
      plotLineColorFalling: "rgba(239, 68, 68, 1)",
      gridLineColor: "rgba(255, 255, 255, 0.05)",
      scaleFontColor: "rgba(148, 163, 184, 1)",
      belowLineFillColorGrowing: "rgba(16, 185, 129, 0.12)",
      belowLineFillColorFalling: "rgba(239, 68, 68, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(16, 185, 129, 0)",
      belowLineFillColorFallingBottom: "rgba(239, 68, 68, 0)",
      symbolActiveColor: "rgba(16, 185, 129, 0.2)",
      tabs: [
        {
          title: "Indices & Markets",
          symbols: [
            { s: "BSE:SENSEX", d: "SENSEX India" },
            { s: "NSE:NIFTY", d: "NIFTY 50" },
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "US Tech 100" }
          ]
        },
        {
          title: "Crypto Intelligence",
          symbols: [
            { s: "BINANCE:BTCUSDT", d: "Bitcoin / USDT" },
            { s: "BINANCE:ETHUSDT", d: "Ethereum / USDT" },
            { s: "BINANCE:SOLUSDT", d: "Solana / USDT" },
            { s: "BINANCE:BNBUSDT", d: "BNB / USDT" }
          ]
        }
      ]
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          Live Financial Markets Data
        </h3>
        <span className="text-xs text-slate-400 font-mono">Real-time TradingView Feed</span>
      </div>
      <div ref={containerRef} className="tradingview-widget-container" />
    </div>
  );
};
