// ─────────────────────────────────────────────────────────────────────────────
// Owner Dashboard — Microfinance Bank Schema
// These interfaces define the shape of data that will come from:
//   GET /owner/metrics          → MicrofinanceDashboardData
//   GET /owner/branches         → BranchPerformance[]
//   GET /owner/field-officers   → FieldOfficerStats[]
// ─────────────────────────────────────────────────────────────────────────────

export interface MicrofinanceKPIs {
  /** Total outstanding loan portfolio (₦) */
  totalLoanPortfolio: number;
  portfolioGrowth: number; // % vs last period

  /** Number of active borrowers (accounts with active loans) */
  activeBorrowers: number;
  borrowerGrowth: number;

  /** Portfolio at Risk (>30 days past due / total portfolio) — % */
  par30: number;
  par30Trend: number; // positive = worsening

  /** Portfolio at Risk (>90 days past due) — % */
  par90: number;

  /** Operational Self-Sufficiency: operating income / operating expenses — % */
  ossRatio: number;
  ossTarget: number; // target threshold (typically 100%)

  /** Total customers (all, including inactive) */
  totalCustomers: number;
  customerGrowth: number;

  /** Number of active staff / loan officers */
  activeStaff: number;

  /** Number of active branches */
  activeBranches: number;
}

export interface LoanPortfolioSummary {
  /** Total amount disbursed since inception (₦) */
  totalDisbursed: number;

  /** Current outstanding balance across all active loans (₦) */
  outstandingBalance: number;

  /** Total amount collected (principal + interest) (₦) */
  totalCollected: number;

  /** Amount written off as bad debt (₦) */
  writeOffs: number;

  /** Breakdown by loan product type */
  byProduct: LoanProductBreakdown[];

  /** Monthly disbursement vs repayment trend (last 6 months) */
  monthlyTrend: MonthlyLoanTrend[];
}

export interface LoanProductBreakdown {
  product: 'Individual' | 'Group' | 'MSME' | 'Agricultural' | 'Emergency';
  activeLoans: number;
  outstandingAmount: number;
  par: number; // % portfolio at risk for this product
  avgTermMonths: number;
  avgLoanSize: number;
}

export interface MonthlyLoanTrend {
  month: string; // e.g. "Jan", "Feb"
  disbursed: number;  // ₦ millions
  repaid: number;     // ₦ millions
  newBorrowers: number;
}

export interface RepaymentHealth {
  /** On-time repayment rate (% of loans current) */
  onTimeRate: number;

  /** 1–30 days past due */
  par1to30: number;
  par1to30Amount: number;

  /** 31–90 days past due */
  par31to90: number;
  par31to90Amount: number;

  /** >90 days past due */
  par90plus: number;
  par90plusAmount: number;

  /** Written off */
  writeOffRate: number;
}

export interface BranchPerformance {
  id: number;
  name: string;
  location: string;
  loanOfficerCount: number;
  activeBorrowers: number;
  portfolioSize: number;      // ₦
  par30: number;              // %
  collectionRate: number;     // %
  efficiencyScore: number;    // 0–100
  status: 'excellent' | 'good' | 'needs-attention' | 'critical';
}

export interface FieldOfficerStats {
  /** Average number of active loans per officer */
  avgLoansPerOfficer: number;

  /** Average collection rate across all officers (%) */
  avgCollectionRate: number;

  /** Average delinquency rate (%) */
  avgDelinquencyRate: number;

  /** Top performing officers */
  topOfficers: OfficerSummary[];

  /** Lowest performing officers (needs support) */
  bottomOfficers: OfficerSummary[];
}

export interface OfficerSummary {
  id: number;
  name: string;
  branchName: string;
  activeLoans: number;
  collectionRate: number;
  par30: number;
}

export interface SavingsMobilization {
  /** Total deposits held across all savings accounts (₦) */
  totalDeposits: number;
  depositGrowth: number; // % vs last period

  /** Average account balance per customer (₦) */
  avgBalancePerCustomer: number;

  /** Number of active savings accounts */
  activeSavingsAccounts: number;

  /** Monthly deposit trend (last 6 months) */
  monthlyDepositTrend: { month: string; amount: number }[];

  /** Customer segmentation */
  segments: CustomerSegment[];

  /** KYC status summary */
  kycStatus: { approved: number; pending: number };
}

export interface CustomerSegment {
  type: 'Individual' | 'Group' | 'MSME';
  count: number;
  percentage: number;
  avgLoanSize: number;
  newThisMonth: number;
}

export interface SocialImpactMetrics {
  /** Total unique beneficiaries reached */
  totalBeneficiaries: number;

  /** % of borrowers who are female */
  femalePercentage: number;

  /** % of borrowers from rural/semi-urban areas */
  ruralPercentage: number;

  /** Estimated jobs created/supported through business loans */
  estimatedJobsCreated: number;

  /** CSR / community spend (₦) */
  csrSpending: number;

  /** Sustainability score (composite 0–100) */
  sustainabilityScore: number;
  sustainabilityBreakdown: {
    repaymentHealth: number;    // 0–100
    outreachGrowth: number;     // 0–100
    genderInclusion: number;    // 0–100
    ruralPenetration: number;   // 0–100
  };
}

export interface OperationalEfficiency {
  /** Total operating expenses (₦) */
  totalOpex: number;

  /** Cost per borrower: opex / active borrowers (₦) */
  costPerBorrower: number;

  /** Cost per loan officer: opex / officers */
  costPerOfficer: number;

  /** Operating expense ratio: opex / loan portfolio (%) */
  opexRatio: number;

  /** Target opex ratio (%) */
  opexTarget: number;

  /** Staff breakdown by role */
  staffByRole: { role: string; count: number }[];
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  detail: string;
  branchName?: string;
  value?: number;
}

/** Root type returned by GET /owner/metrics */
export interface MicrofinanceDashboardData {
  kpis: MicrofinanceKPIs;
  loanPortfolio: LoanPortfolioSummary;
  repaymentHealth: RepaymentHealth;
  branches: BranchPerformance[];
  fieldOfficers: FieldOfficerStats;
  savings: SavingsMobilization;
  socialImpact: SocialImpactMetrics;
  operationalEfficiency: OperationalEfficiency;
  alerts: AlertItem[];
  generatedAt: string; // ISO timestamp
}
