/**
 * Industry-calibrated mathematical models for Amazon KDP & Kindle Best Seller Rank (ABSR)
 * Modeled after empirical KDP data sets and Publisher Rocket benchmark algorithms.
 */

export function calculateDailySalesFromABSR(absr: number, format: 'kindle' | 'paperback' = 'kindle'): number {
  if (!absr || absr <= 0) return 0;

  // Calibrated non-linear curve for Amazon Kindle eBooks vs Print Books
  if (format === 'kindle') {
    if (absr <= 5) return Math.round(3500 - (absr - 1) * 200);
    if (absr <= 20) return Math.round(2000 - (absr - 5) * 60);
    if (absr <= 100) return Math.round(1000 - (absr - 20) * 8.5);
    if (absr <= 500) return Math.round(300 - (absr - 100) * 0.45);
    if (absr <= 1000) return Math.round(120 - (absr - 500) * 0.12);
    if (absr <= 5000) return Math.round(60 - (absr - 1000) * 0.009);
    if (absr <= 10000) return Math.round(25 - (absr - 5000) * 0.0028);
    if (absr <= 50000) return Math.round(11 - (absr - 10000) * 0.00017);
    if (absr <= 100000) return Math.round(4 - (absr - 50000) * 0.00004);
    if (absr <= 300000) return 1;
    return 0;
  } else {
    // Paperback curve: print books have a slightly different velocity curve
    if (absr <= 10) return Math.round(1800 - (absr - 1) * 80);
    if (absr <= 100) return Math.round(600 - (absr - 10) * 5);
    if (absr <= 1000) return Math.round(100 - (absr - 100) * 0.08);
    if (absr <= 10000) return Math.round(30 - (absr - 1000) * 0.0022);
    if (absr <= 50000) return Math.round(10 - (absr - 10000) * 0.00015);
    if (absr <= 150000) return 1;
    return 0;
  }
}

export function calculateMonthlySalesFromDaily(dailySales: number): number {
  return Math.round(dailySales * 30.4);
}

export function calculateRoyalties({
  price,
  format = 'kindle',
  pageCount = 200,
  isColor = false,
  dailySales = 10,
}: {
  price: number;
  format: 'kindle' | 'paperback';
  pageCount?: number;
  isColor?: boolean;
  dailySales?: number;
}): {
  royaltyPerCopy: number;
  dailyRoyalty: number;
  monthlyRoyalty: number;
  yearlyRoyalty: number;
  royaltyRatePercent: number;
  printingCost: number;
} {
  let royaltyPerCopy = 0;
  let printingCost = 0;
  let royaltyRatePercent = 70;

  if (format === 'kindle') {
    // Amazon Kindle standard: 70% between $2.99 and $9.99, else 35%
    if (price >= 2.99 && price <= 9.99) {
      royaltyRatePercent = 70;
      const deliveryFee = 0.15; // Typical 1MB eBook delivery fee
      royaltyPerCopy = Math.max(0, price * 0.70 - deliveryFee);
    } else {
      royaltyRatePercent = 35;
      royaltyPerCopy = Math.max(0, price * 0.35);
    }
  } else {
    // Paperback: Fixed $1.00 base + per-page cost, Amazon takes 40% (author gets 60% of list price minus print cost)
    royaltyRatePercent = 60;
    const baseCost = 1.00;
    const pageCost = isColor ? 0.065 : 0.012;
    printingCost = Number((baseCost + pageCount * pageCost).toFixed(2));
    royaltyPerCopy = Math.max(0, price * 0.60 - printingCost);
  }

  const dailyRoyalty = Number((royaltyPerCopy * dailySales).toFixed(2));
  const monthlyRoyalty = Number((dailyRoyalty * 30.4).toFixed(2));
  const yearlyRoyalty = Number((monthlyRoyalty * 12).toFixed(2));

  return {
    royaltyPerCopy: Number(royaltyPerCopy.toFixed(2)),
    dailyRoyalty,
    monthlyRoyalty,
    yearlyRoyalty,
    royaltyRatePercent,
    printingCost,
  };
}

export function calculateRocketCompetitiveScore(
  competitorCount: number,
  avgReviews: number,
  avgAbsr: number
): number {
  // Score from 1 to 100: lower is easier (Green), higher is harder (Red)
  let score = 25;

  // Competitor count factor
  if (competitorCount > 5000) score += 30;
  else if (competitorCount > 2000) score += 20;
  else if (competitorCount > 1000) score += 12;
  else if (competitorCount > 300) score += 5;

  // Review velocity factor
  if (avgReviews > 2000) score += 25;
  else if (avgReviews > 500) score += 16;
  else if (avgReviews > 100) score += 8;

  // ABSR factor (if top competitors have ultra-high ranks, tough barrier to entry)
  if (avgAbsr < 2000) score += 20;
  else if (avgAbsr < 15000) score += 10;
  else if (avgAbsr > 150000) score -= 10;

  return Math.max(5, Math.min(98, Math.round(score)));
}

export function calculateOpportunityScore(searches: number, competitiveScore: number): number {
  // High searches + Low competitive score = High Opportunity (1-100)
  const searchWeight = Math.min(60, Math.log10(Math.max(10, searches)) * 15);
  const inverseComp = Math.max(0, 100 - competitiveScore) * 0.4;
  return Math.min(99, Math.max(10, Math.round(searchWeight + inverseComp)));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
