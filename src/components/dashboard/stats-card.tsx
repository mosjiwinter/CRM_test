'use client';

import { useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  chartData?: { [key: string]: any }[];
  chartKey?: string;
};

export function StatsCard({ title, value, icon: Icon, description, chartData, chartKey }: StatsCardProps) {
  const chartId = useId();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {chartData && chartKey && (
             <div className="h-10 w-24">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey={chartKey} 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1} 
                            fill={`url(#${chartId})`}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
