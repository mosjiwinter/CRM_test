'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, PlusCircle, Trash2 } from 'lucide-react';
import { subDays, startOfDay, format, eachDayOfInterval } from 'date-fns';

import { DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useAppContext } from '@/lib/app-context';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { RevenueBreakdownChart } from '@/components/dashboard/revenue-breakdown-chart';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

function SortableItem({ id, children, onRemove }: { id: string; children: React.ReactNode; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative group/sortable">
        {children}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/sortable:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
                onClick={() => onRemove(id)}
                className="p-2 bg-card/70 rounded-md hover:bg-destructive hover:text-destructive-foreground focus:opacity-100 group"
                aria-label="Remove widget"
            >
                <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive-foreground" />
            </button>
            <button 
                {...listeners} 
                className="p-2 bg-card/70 rounded-md hover:bg-accent hover:text-accent-foreground cursor-grab active:cursor-grabbing focus:opacity-100 group"
                aria-label="Drag to reorder"
            >
                <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
            </button>
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { transactions, customers } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddWidgetDialogOpen, setIsAddWidgetDialogOpen] = useState(false);

  const allWidgets = useMemo(() => ({
    overview: { name: 'Overview', component: <OverviewChart data={transactions} /> },
    recent: { name: 'Recent Transactions', component: <RecentTransactions transactions={transactions} /> },
    revenueBreakdown: { name: 'Revenue Breakdown', component: <RevenueBreakdownChart transactions={transactions} /> },
    expenseBreakdown: { name: 'Expense Breakdown', component: <ExpenseBreakdownChart transactions={transactions} /> },
    aiInsights: { name: 'AI Insights', component: <AIInsights transactions={transactions} /> },
  }), [transactions]);

  const [dashboardWidgets, setDashboardWidgets] = useState<string[]>(['overview', 'recent', 'revenueBreakdown', 'expenseBreakdown']);

  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        const validWidgets = parsedLayout.filter((widgetId: string) => allWidgets.hasOwnProperty(widgetId));
        setDashboardWidgets(validWidgets);
      } catch (e) {
        setDashboardWidgets(['overview', 'recent', 'revenueBreakdown', 'expenseBreakdown']);
      }
    }
    setIsMounted(true);
  }, [allWidgets]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dashboardLayout', JSON.stringify(dashboardWidgets));
    }
  }, [dashboardWidgets, isMounted]);

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
  
  const customerTrendData = useMemo(() => {
    const ninetyDaysAgo = subDays(startOfDay(new Date()), 89);
    const dateRange = eachDayOfInterval({ start: ninetyDaysAgo, end: new Date() });

    const dailyCounts: Record<string, number> = {};
    dateRange.forEach(date => {
      dailyCounts[format(date, 'yyyy-MM-dd')] = 0;
    });

    customers.forEach(customer => {
      const joinDate = startOfDay(customer.createdAt);
      if (joinDate >= ninetyDaysAgo) {
        const dateStr = format(joinDate, 'yyyy-MM-dd');
        if (dailyCounts[dateStr] !== undefined) {
            dailyCounts[dateStr]++;
        }
      }
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [customers]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDashboardWidgets((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  
  const removeWidget = (id: string) => {
    setDashboardWidgets(widgets => widgets.filter(widgetId => widgetId !== id));
  };
  
  const addWidget = (id: string) => {
    if (!dashboardWidgets.includes(id)) {
        setDashboardWidgets(widgets => [...widgets, id]);
    }
    setIsAddWidgetDialogOpen(false);
  };

  const availableWidgets = Object.keys(allWidgets).filter(
    (widgetId) => !dashboardWidgets.includes(widgetId)
  );

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
        <StatsCard
          title="Total Customers"
          value={customers.length.toString()}
          icon={Users}
          description={`+${customerTrendData.reduce((sum, day) => sum + day.count, 0)} in last 90 days`}
          chartData={customerTrendData}
          chartKey="count"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={() => setIsAddWidgetDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Widget
        </Button>
      </div>

      {isMounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={dashboardWidgets} strategy={rectSortingStrategy}>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
              {dashboardWidgets.map((id) => (
                <SortableItem key={id} id={id} onRemove={removeWidget}>
                  {allWidgets[id as keyof typeof allWidgets].component}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          {dashboardWidgets.map((id) => (
            <div key={id}>
                {allWidgets[id as keyof typeof allWidgets].component}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddWidgetDialogOpen} onOpenChange={setIsAddWidgetDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a widget to your dashboard</DialogTitle>
                <DialogDescription>
                    Select a widget to add. You can reorder and remove them later.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {availableWidgets.length > 0 ? (
                    availableWidgets.map(widgetId => (
                        <Card 
                            key={widgetId} 
                            onClick={() => addWidget(widgetId)}
                            className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg">{allWidgets[widgetId as keyof typeof allWidgets].name}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground md:col-span-2 text-center">All available widgets are already on your dashboard.</p>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
