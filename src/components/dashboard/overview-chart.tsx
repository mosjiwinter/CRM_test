'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type OverviewChartProps = {
  data: Transaction[];
};

export function OverviewChart({ data }: OverviewChartProps) {
  const processData = (transactions: Transaction[]) => {
    const monthlyData: { [key: string]: { revenue: number; expense: number } } = {};

    transactions.forEach(transaction => {
      const month = transaction.date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expense: 0 };
      }
      if (transaction.type === 'revenue') {
        monthlyData[month].revenue += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const dateA = new Date(`1 ${monthA} ${yearA}`);
        const dateB = new Date(`1 ${monthB} ${yearB}`);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(month => ({
      name: month,
      Revenue: monthlyData[month].revenue,
      Expenses: monthlyData[month].expense,
    }));
  };

  const chartData = processData(data);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Your revenue and expenses over time.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
            />
            <Legend />
            <Bar dataKey="Revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
