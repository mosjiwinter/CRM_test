'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getColumns } from '@/components/projects/columns';
import { DataTable } from '@/components/transactions/data-table';
import { ProjectDialog } from '@/components/projects/project-dialog';
import type { Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/lib/app-context';

export default function ProjectsPage() {
  const { projects, customers, transactions, addOrUpdateProject, deleteProject } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);

  const openDialog = (project?: Project) => {
    setProjectToEdit(project);
    setIsDialogOpen(true);
  };

  const projectsWithFinancials = useMemo(() => {
    return projects.map(project => {
      const relevantTransactions = transactions.filter(t => t.projectId === project.id);
      const totalRevenue = relevantTransactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = relevantTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const profit = totalRevenue - totalExpenses;
      const spendPercentage = project.budget && project.budget > 0 ? Math.min((totalExpenses / project.budget) * 100, 100) : 0;
      
      return {
        ...project,
        profit,
        totalExpenses,
        spendPercentage,
      };
    });
  }, [projects, transactions]);

  const columns = getColumns(openDialog, deleteProject, customers);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-end">
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={projectsWithFinancials} filterKey="name" filterPlaceholder="Filter by name..." />
        </CardContent>
      </Card>
      <ProjectDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addOrUpdateProject={addOrUpdateProject}
        projectToEdit={projectToEdit}
        customers={customers}
      />
    </main>
  );
}
