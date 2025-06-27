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

const statusVariantMap: { [key in Project['status']]: 'default' | 'secondary' | 'outline' } = {
  'Completed': 'default',
  'In Progress': 'secondary',
  'Not Started': 'outline',
};

export const getColumns = (
    openDialog: (project?: Project) => void, 
    deleteProject: (id: string) => void,
    customers: Customer[]
): ColumnDef<Project>[] => [
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
  },
  {
    accessorKey: 'customerId',
    header: 'Customer',
    cell: ({ row }) => {
        const customerId = row.getValue('customerId') as string;
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.name : 'Unknown';
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
    accessorKey: 'deadline',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Deadline
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.getValue('deadline')).toLocaleDateString(),
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
