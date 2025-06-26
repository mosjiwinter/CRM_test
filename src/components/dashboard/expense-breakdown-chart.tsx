'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';

export function ExpenseBreakdownChart({ transactions }: { transactions: Transaction[] }) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const expenseByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce<Record<string, number>>((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});
    
    const data = Object.entries(expenseByCategory).map(([category, total]) => ({
        name: category,
        value: total,
    }));

    const config: ChartConfig = {};
    data.forEach((item, index) => {
        config[item.name] = {
            label: item.name,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
    });

    return { chartData: data, chartConfig: config };
  }, [transactions]);


  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Your spending by category.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[328px] w-full items-center justify-center">
                <p className="text-muted-foreground">No expense data available.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Your spending by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                hideLabel 
                formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
              />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry) => (
                    <Cell 
                        key={`cell-${entry.name}`} 
                        fill={chartConfig[entry.name]?.color}
                    />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
