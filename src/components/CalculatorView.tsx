import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  Sparkles, 
  PieChart,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { 
  calculateDailySalesFromABSR, 
  calculateMonthlySalesFromDaily, 
  calculateRoyalties, 
  formatCurrency, 
  formatNumber 
} from '../utils/amazonCalculators';
import { Language, translations } from '../i18n/translations';

interface CalculatorViewProps {
  lang: Language;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [absrInput, setAbsrInput] = useState<number>(1450);
  const [format, setFormat] = useState<'kindle' | 'paperback'>('kindle');
  const [price, setPrice] = useState<number>(4.99);
  const [pageCount, setPageCount] = useState<number>(240);
  const [isColor, setIsColor] = useState<boolean>(false);

  // Calculations
  const estimatedDailySales = calculateDailySalesFromABSR(absrInput, format);
  const estimatedMonthlySales = calculateMonthlySalesFromDaily(estimatedDailySales);

  const royaltyData = calculateRoyalties({
    price,
    format,
    pageCount,
    isColor,
    dailySales: estimatedDailySales,
  });

  return (
    <div className="space-y-6">
      
      {/* Introduction Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/80 shadow-xl">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          {t.calculatorTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {t.calculatorSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
            {t.simulatorParams}
          </h3>

          {/* Format Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">{t.bookFormatLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormat('kindle');
                  if (price > 9.99) setPrice(4.99);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  format === 'kindle'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📱 {t.kindleEbook}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormat('paperback');
                  if (price < 9.99) setPrice(14.99);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  format === 'paperback'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📖 {t.paperback}
              </button>
            </div>
          </div>

          {/* Amazon Best Seller Rank (ABSR) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">{t.absrLabel}</span>
              <span className="font-mono font-bold text-amber-300">#{formatNumber(absrInput)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="150000"
              step="50"
              value={absrInput}
              onChange={(e) => setAbsrInput(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex gap-2 pt-1 flex-wrap">
              {[50, 500, 1500, 5000, 15000, 50000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAbsrInput(preset)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
                >
                  #{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Retail List Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">{t.listPriceLabel}</span>
              <span className="font-mono font-bold text-emerald-400">${price.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.99"
              max="29.99"
              step="0.50"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            {format === 'kindle' && (
              <p className="text-[10px] text-slate-400">
                {price >= 2.99 && price <= 9.99 ? (
                  <span className="text-emerald-400">{t.eligible70Royalty}</span>
                ) : (
                  <span className="text-amber-400">{t.outsideBracket35}</span>
                )}
              </p>
            )}
          </div>

          {/* Paperback Specific Options */}
          {format === 'paperback' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">{t.pageCountLabel}</span>
                <span className="font-mono font-bold text-white">{pageCount} pages</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="10"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />

              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                <input
                  type="checkbox"
                  id="colorCheckbox"
                  checked={isColor}
                  onChange={(e) => setIsColor(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                <label htmlFor="colorCheckbox" className="text-xs text-slate-300 cursor-pointer">
                  {t.colorInteriorLabel}
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Sales Velocity Output */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              {t.projectedVelocity}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.estDailySalesBox}</span>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formatNumber(estimatedDailySales)}
                </div>
                <span className="text-[10px] text-slate-500">copies / day</span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.estMonthlySalesBox}</span>
                <div className="text-xl sm:text-2xl font-black text-cyan-400">
                  {formatNumber(estimatedMonthlySales)}
                </div>
                <span className="text-[10px] text-slate-500">copies / mo</span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.royaltyPerCopyBox}</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  ${royaltyData.royaltyPerCopy}
                </div>
                <span className="text-[10px] text-slate-500">{royaltyData.royaltyRatePercent}% rate</span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.estMonthlyNetBox}</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-300">
                  {formatCurrency(royaltyData.monthlyRoyalty)}
                </div>
                <span className="text-[10px] text-slate-500">author royalties</span>
              </div>
            </div>

            {/* Annual Projected Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400">{t.annualProjectedBox}</span>
                <div className="text-2xl font-extrabold text-white mt-0.5">
                  {formatCurrency(royaltyData.yearlyRoyalty)} <span className="text-xs text-slate-400 font-normal">/ year</span>
                </div>
              </div>
              <div className="text-right rtl:text-left text-xs text-slate-400">
                <span>At Rank #{formatNumber(absrInput)}</span>
                <p className="text-[10px] text-slate-500">Assuming constant sales velocity</p>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">{t.perCopyDistribution}</span>
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  style={{ width: `${(royaltyData.royaltyPerCopy / price) * 100}%` }}
                  className="bg-emerald-500 transition-all"
                  title="Author Royalty"
                />
                {format === 'paperback' && (
                  <div
                    style={{ width: `${(royaltyData.printingCost / price) * 100}%` }}
                    className="bg-amber-500 transition-all"
                    title="Printing Cost"
                  />
                )}
                <div
                  style={{
                    width: `${
                      100 -
                      (royaltyData.royaltyPerCopy / price) * 100 -
                      (format === 'paperback' ? (royaltyData.printingCost / price) * 100 : 0)
                    }%`,
                  }}
                  className="bg-indigo-600 transition-all"
                  title="Amazon Platform Cut"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  {t.authorProfit} <strong className="text-white">${royaltyData.royaltyPerCopy}</strong>
                </span>
                {format === 'paperback' && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    {t.printingCost} <strong className="text-white">${royaltyData.printingCost}</strong>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                  {t.amazonShare} <strong className="text-white">
                    ${(price - royaltyData.royaltyPerCopy - (format === 'paperback' ? royaltyData.printingCost : 0)).toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
