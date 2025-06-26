'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getColumns } from '@/components/customers/columns';
import { DataTable } from '@/components/transactions/data-table';
import { CustomerDialog } from '@/components/customers/customer-dialog';
import { initialCustomers } from '@/lib/data';
import type { Customer } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | undefined>(undefined);

  const openDialog = (customer?: Customer) => {
    setCustomerToEdit(customer);
    setIsDialogOpen(true);
  };
  
  const addOrUpdateCustomer = (customerData: Omit<Customer, 'createdAt'>) => {
    setCustomers(current => {
      const existing = current.find(t => t.id === customerData.id);
      if (existing) {
        return current.map(t => t.id === customerData.id ? { ...t, ...customerData } : t);
      }
      return [...current, { ...customerData, createdAt: new Date() }];
    });
  };
  
  const deleteCustomer = (id: string) => {
    setCustomers(current => current.filter(t => t.id !== id));
  };

  const columns = getColumns(openDialog, deleteCustomer);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-end">
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={customers} filterKey="name" filterPlaceholder="Filter by name..." />
        </CardContent>
      </Card>
      <CustomerDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addOrUpdateCustomer={addOrUpdateCustomer}
        customerToEdit={customerToEdit}
      />
    </main>
  );
}
