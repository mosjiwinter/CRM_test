'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getColumns } from '@/components/customers/columns';
import { DataTable } from '@/components/transactions/data-table';
import { CustomerDialog } from '@/components/customers/customer-dialog';
import type { Customer } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/lib/app-context';

export default function CustomersPage() {
  const { customers, addOrUpdateCustomer, deleteCustomer } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | undefined>(undefined);

  const openDialog = (customer?: Customer) => {
    setCustomerToEdit(customer);
    setIsDialogOpen(true);
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
