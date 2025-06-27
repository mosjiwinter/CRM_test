'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project, Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const statusVariantMap: { [key in Project['status']]: 'default' | 'secondary' | 'outline' } = {
  'Completed': 'default',
  'In Progress': 'secondary',
  'Not Started': 'outline',
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

// Define the type for the data that the table will receive
// It includes the original Project type plus our calculated fields
export type ProjectWithFinancials = Project & {
    profit: number;
    totalExpenses: number;
    spendPercentage: number;
};


export const getColumns = (
    openDialog: (project?: Project) => void, 
    deleteProject: (id: string) => void,
    customers: Customer[],
): ColumnDef<ProjectWithFinancials>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Project Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const project = row.original;
        const customer = customers.find(c => c.id === project.customerId);
        return (
            <div>
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-muted-foreground">{customer?.name || 'Unknown'}</div>
            </div>
        )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as Project['status'];
        return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
    }
  },
  {
    accessorKey: 'budget',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Budget
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const budget = row.original.budget;
        return budget ? formatCurrency(budget) : <span className="text-muted-foreground">-</span>;
    }
  },
  {
    id: 'profitability',
    header: 'Profitability',
    accessorKey: 'profit', // Use the pre-calculated accessor
    cell: ({ row }) => {
        const profit = row.original.profit;
        return (
            <div className={`font-medium ${profit >= 0 ? 'text-positive' : 'text-negative'}`}>
                {formatCurrency(profit)}
            </div>
        )
    }
  },
  {
    id: 'spend',
    header: 'Spend vs Budget',
    cell: ({ row }) => {
        const project = row.original;
        if (!project.budget) {
            return <span className="text-muted-foreground text-center">-</span>;
        }
        const { totalExpenses, spendPercentage } = project;
        
        return (
            <div className="flex flex-col gap-1">
                <Progress value={spendPercentage} className="h-2" />
                <span className="text-xs text-muted-foreground">
                    {formatCurrency(totalExpenses)} / {formatCurrency(project.budget)}
                </span>
            </div>
        )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openDialog(project)}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => deleteProject(project.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
