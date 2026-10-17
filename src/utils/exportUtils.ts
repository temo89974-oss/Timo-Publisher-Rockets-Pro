import jsPDF from 'jspdf';
import { KeywordItem, CompetitorBook, AmazonCategory, AmazonAdTarget, TitleIdea, WhiteLabelConfig } from '../types';
import { formatCurrency, formatNumber } from './amazonCalculators';

// ==================== CSV EXPORTERS ====================

export function exportKeywordsToCSV(keywords: KeywordItem[], filename = 'KDP_Keywords_Analysis.csv') {
  const headers = [
    'Keyword',
    'Amazon Searches / Mo',
    'Google Searches / Mo',
    'Avg Monthly Earnings ($)',
    'Competitors Count',
    'Rocket Competitive Score (1-100)',
    'Opportunity Score (1-100)',
    'Trend',
    'KDP 7 Backend Slot',
    'Semantic Cluster',
    'Notes',
  ];

  const rows = keywords.map(k => [
    `"${k.keyword.replace(/"/g, '""')}"`,
    k.amazonSearches,
    k.googleSearches,
    k.avgMonthlyEarnings,
    k.competitorCount,
    k.competitiveScore,
    k.opportunityScore,
    k.trend,
    k.isSelectedBackend ? 'YES (Slot)' : 'No',
    `"${(k.semanticCluster || '').replace(/"/g, '""')}"`,
    `"${(k.notes || '').replace(/"/g, '""')}"`,
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), filename);
}

export function exportCompetitorsToCSV(competitors: CompetitorBook[], filename = 'KDP_Competitors_Audit.csv') {
  const headers = [
    'ASIN',
    'Title',
    'Subtitle',
    'Author',
    'Amazon Best Seller Rank (ABSR)',
    'Est. Daily Sales (Copies)',
    'Est. Monthly Sales (Copies)',
    'Est. Monthly Revenue ($)',
    'Price ($)',
    'Page Count',
    'Rating',
    'Reviews Count',
    'Keyword in Title',
    'Keyword in Subtitle',
    'Publisher Type',
    'Tactical Insight',
  ];

  const rows = competitors.map(c => [
    c.asin,
    `"${c.title.replace(/"/g, '""')}"`,
    `"${(c.subtitle || '').replace(/"/g, '""')}"`,
    `"${c.author.replace(/"/g, '""')}"`,
    c.absr,
    c.estDailySales,
    c.estMonthlySales,
    c.estMonthlyRevenue,
    c.price,
    c.pageCount,
    c.rating,
    c.reviewsCount,
    c.hasKeywordInTitle ? 'YES' : 'NO',
    c.hasKeywordInSubtitle ? 'YES' : 'NO',
    c.publisherType,
    `"${(c.tacticalInsight || '').replace(/"/g, '""')}"`,
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), filename);
}

export function exportAmazonAdsBulkCSV(ads: AmazonAdTarget[], campaignName = 'KDP_Auto_Campaign', filename = 'Amazon_Ads_Bulk_Upload.csv') {
  // Amazon Advertising Bulk Template Header Format
  const headers = [
    'Campaign Name',
    'Targeting Type',
    'Keyword / Target',
    'Match Type',
    'Bid ($)',
    'State',
    'Estimated Impressions',
    'Relevance Score',
  ];

  const rows = ads.map(a => [
    `"${campaignName}"`,
    `"${a.targetType}"`,
    `"${a.targetValue.replace(/"/g, '""')}"`,
    `"${a.matchType}"`,
    a.suggestedBid.toFixed(2),
    'enabled',
    `"${a.estImpressions}"`,
    a.relevanceScore,
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), filename);
}

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== WHITE-LABEL PDF REPORT EXPORTER ====================

export function generateWhiteLabelPDFReport({
  whiteLabel,
  nicheQuery,
  keywords,
  competitors,
  categories,
  adTargets,
  titleIdeas,
}: {
  whiteLabel: WhiteLabelConfig;
  nicheQuery: string;
  keywords: KeywordItem[];
  competitors: CompetitorBook[];
  categories: AmazonCategory[];
  adTargets: AmazonAdTarget[];
  titleIdeas: TitleIdea[];
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Colors
  const primaryNavy = [15, 23, 42]; // #0f172a
  const accentIndigo = [79, 70, 229]; // #4f46e5
  const slateDark = [51, 65, 85];
  const emeraldGreen = [16, 185, 129];

  // ============ PAGE 1: COVER & EXECUTIVE SUMMARY ============
  // Header bar
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent line
  doc.setFillColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Agency Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(whiteLabel.agencyName || 'Amazon Publishing Intelligence', margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(199, 210, 254);
  doc.text(whiteLabel.tagline || 'Confidential KDP Market Intelligence Dossier', margin, 26);
  doc.text(`Client: ${whiteLabel.clientName || 'Private Publisher'}  |  Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`, margin, 34);

  // Report Title
  let y = 56;
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`KDP Market Intelligence & Launch Blueprint`, margin, y);
  
  y += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Target Search Vector / Core Niche: "${nicheQuery.toUpperCase()}"`, margin, y);

  // Executive Summary Card
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 3, 3, 'FD');

  const top7 = keywords.filter(k => k.isSelectedBackend).slice(0, 7);
  const totalSearches = top7.reduce((acc, k) => acc + k.amazonSearches, 0);
  const avgCompScore = Math.round(top7.reduce((acc, k) => acc + k.competitiveScore, 0) / Math.max(1, top7.length));
  const totalCompetitorRev = competitors.reduce((acc, c) => acc + c.estMonthlyRevenue, 0);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.text('EXECUTIVE MARKET PULSE', margin + 6, y + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(`- Combined Amazon Searches (Top 7 Keywords): ${formatNumber(totalSearches)} / month`, margin + 6, y + 16);
  doc.text(`- Average Rocket Competition Difficulty: ${avgCompScore}/100 (${avgCompScore <= 35 ? 'HIGH OPPORTUNITY / LOW RIVALRY' : avgCompScore <= 60 ? 'BALANCED' : 'HIGH EFFORT'})`, margin + 6, y + 22);
  doc.text(`- Top Competitors Total Monthly Revenue Pool: ${formatCurrency(totalCompetitorRev)} / month`, margin + 6, y + 28);
  doc.text(`- Recommended Categories to Claim #1 Bestseller: ${categories.length} mapped sub-niches`, margin + 6, y + 34);

  // Section 1: The 7 KDP Backend Keywords
  y += 46;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('1. The 7 KDP Backend Keywords Blueprint', margin, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Copy these exact 7 phrases into your KDP Book Setup > Keywords slots (Amazon allows 7 boxes).', margin, y + 5);

  y += 8;
  // Table header
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Slot', margin + 3, y + 4.8);
  doc.text('Keyword Phrase', margin + 18, y + 4.8);
  doc.text('Amazon Searches', margin + 90, y + 4.8);
  doc.text('Avg Monthly $', margin + 125, y + 4.8);
  doc.text('Difficulty', margin + 155, y + 4.8);

  y += 7;
  top7.forEach((kw, idx) => {
    const rowColor = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
    doc.text(`#${idx + 1}`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(kw.keyword.substring(0, 45), margin + 18, y + 4.5);
    doc.text(formatNumber(kw.amazonSearches), margin + 90, y + 4.5);
    doc.text(formatCurrency(kw.avgMonthlyEarnings), margin + 125, y + 4.5);

    // Score badge
    const diffText = `${kw.competitiveScore}/100`;
    doc.setFont('helvetica', 'bold');
    if (kw.competitiveScore <= 35) doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    else if (kw.competitiveScore <= 60) doc.setTextColor(234, 88, 12);
    else doc.setTextColor(220, 38, 38);
    doc.text(diffText, margin + 155, y + 4.5);

    y += 6.5;
  });

  // Footer on Page 1
  addWhiteLabelFooter(doc, whiteLabel, 1, 2);

  // ============ PAGE 2: COMPETITOR INTELLIGENCE & CATEGORIES ============
  doc.addPage();
  y = 18;

  // Mini header
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('2. Top Competitor Sales & ABSR Benchmark', margin, y);

  y += 7;
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Book Title & Author', margin + 3, y + 4.8);
  doc.text('ABSR', margin + 82, y + 4.8);
  doc.text('Daily Sales', margin + 104, y + 4.8);
  doc.text('Est. Mo. Revenue', margin + 128, y + 4.8);
  doc.text('Rating / Reviews', margin + 158, y + 4.8);

  y += 7;
  competitors.slice(0, 6).forEach((comp, idx) => {
    const rowColor = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 9, pageWidth - margin, y + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(comp.title.substring(0, 42), margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`by ${comp.author.substring(0, 30)} (${comp.publisherType})`, margin + 3, y + 7.5);

    doc.setFontSize(7.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(`#${formatNumber(comp.absr)}`, margin + 82, y + 5);
    doc.text(`${formatNumber(comp.estDailySales)} units`, margin + 104, y + 5);
    doc.text(formatCurrency(comp.estMonthlyRevenue), margin + 128, y + 5);
    doc.text(`${comp.rating} ★ (${formatNumber(comp.reviewsCount)})`, margin + 158, y + 5);

    y += 9;
  });

  // Section 3: Recommended Categories & #1 Bestseller Blueprint
  y += 12;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('3. Category Roadmap to #1 Amazon Bestseller', margin, y);

  y += 6;
  categories.slice(0, 4).forEach((cat, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
    doc.text(cat.name, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(cat.fullBreadcrumb.substring(0, 90), margin + 4, y + 9.5);

    // Sales metrics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(`Sales for #1: `, margin + 120, y + 5);
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.text(`${cat.salesForNumberOne} books/day`, margin + 140, y + 5);

    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(`Top 10 cutoff: ${cat.salesForTopTen} books/day`, margin + 120, y + 9.5);

    y += 16;
  });

  // Section 4: Title Recommendations
  if (titleIdeas.length > 0) {
    y += 4;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text('4. High-Converting Book Title & Hook Concept', margin, y);

    y += 6;
    const topTitle = titleIdeas[0];
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`Title: "${topTitle.title}: ${topTitle.subtitle}"`, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`Hook: "${topTitle.hook}"`, margin + 4, y + 10.5);
    doc.text(`Keywords Embedded: ${topTitle.primaryKeywords.join(', ')}`, margin + 4, y + 14.5);
  }

  addWhiteLabelFooter(doc, whiteLabel, 2, 2);

  // Save PDF
  const cleanFilename = `${(whiteLabel.agencyName || 'KDP_Intelligence').replace(/\s+/g, '_')}_${nicheQuery.replace(/\s+/g, '_')}_Report.pdf`;
  doc.save(cleanFilename);
}

function addWhiteLabelFooter(doc: jsPDF, whiteLabel: WhiteLabelConfig, currentPage: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);

  const footerText = whiteLabel.reportFooterNote || `Generated by ${whiteLabel.agencyName || 'Publisher Intelligence Suite'} - 100% Confidential Client Report.`;
  doc.text(footerText, margin, pageHeight - 7);

  const contactText = whiteLabel.contactEmail ? `${whiteLabel.contactEmail} | ` : '';
  doc.text(`${contactText}Page ${currentPage} of ${totalPages}`, pageWidth - margin - 35, pageHeight - 7);
}
