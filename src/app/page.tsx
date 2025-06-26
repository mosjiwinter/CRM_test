'use client';

import { DollarSign, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { useAppContext } from '@/lib/app-context';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { RevenueBreakdownChart } from '@/components/dashboard/revenue-breakdown-chart';

export default function DashboardPage() {
  const { transactions } = useAppContext();

  const totalRevenue = transactions
    .filter((t) => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalRevenue - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          description="+20.1% from last month"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={Wallet}
          description="+18.1% from last month"
        />
        <StatsCard
          title="Profit"
          value={formatCurrency(profit)}
          icon={profit >= 0 ? ArrowUpRight : ArrowDownLeft}
          description="+19% from last month"
        />
        <AIInsights transactions={transactions} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <OverviewChart data={transactions} />
        <RecentTransactions transactions={transactions} />
      </div>
      <div className="grid gap-4 md:gap-8 md:grid-cols-2">
        <RevenueBreakdownChart transactions={transactions} />
        <ExpenseBreakdownChart transactions={transactions} />
      </div>
    </main>
  );
}
