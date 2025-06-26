'use client';

import { useState } from 'react';
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
import { GripVertical } from 'lucide-react';

import { DollarSign, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { useAppContext } from '@/lib/app-context';
import { ExpenseBreakdownChart } from '@/components/dashboard/expense-breakdown-chart';
import { RevenueBreakdownChart } from '@/components/dashboard/revenue-breakdown-chart';

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
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
        <button {...listeners} className="absolute top-4 right-4 p-2 bg-card/50 rounded-md hover:bg-accent cursor-grab active:cursor-grabbing opacity-0 group-hover/sortable:opacity-100 focus:opacity-100 transition-opacity">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}


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
  
  const chartComponents = {
    overview: <OverviewChart data={transactions} />,
    recent: <RecentTransactions transactions={transactions} />,
    revenueBreakdown: <RevenueBreakdownChart transactions={transactions} />,
    expenseBreakdown: <ExpenseBreakdownChart transactions={transactions} />,
  };

  const [chartOrder, setChartOrder] = useState<string[]>(['overview', 'recent', 'revenueBreakdown', 'expenseBreakdown']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            {chartOrder.map((id) => (
              <SortableItem key={id} id={id}>
                {chartComponents[id as keyof typeof chartComponents]}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </main>
  );
}
