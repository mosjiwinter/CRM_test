import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CustomersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customers here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Customer management functionality coming soon!</p>
        </CardContent>
      </Card>
    </main>
  );
}
