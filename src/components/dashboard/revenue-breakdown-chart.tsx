'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';

export function RevenueBreakdownChart({ transactions }: { transactions: Transaction[] }) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const revenueByCategory = transactions
      .filter((t) => t.type === 'revenue')
      .reduce<Record<string, number>>((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});
    
    const data = Object.entries(revenueByCategory).map(([category, total]) => ({
        name: category,
        total: total,
    })).sort((a,b) => b.total - a.total);

    const config: ChartConfig = {
        total: {
            label: "Total",
            color: "hsl(var(--chart-1))",
        }
    };

    return { chartData: data, chartConfig: config };
  }, [transactions]);


  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Your income by category.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[328px] w-full items-center justify-center">
                <p className="text-muted-foreground">No revenue data available.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Your income by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={100}
              className="text-sm fill-muted-foreground"
              
            />
            <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
                  />
                }
              />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}