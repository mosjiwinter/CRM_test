'use client';

import { useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { seedDatabase } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSeedData = () => {
    startTransition(async () => {
      const result = await seedDatabase();
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings and set your preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Shad CN" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="ui@shadcn.com" />
            </div>
            <Button>Update Account</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive emails about your account activity.
                </span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Get push notifications on your devices.
                </span>
              </Label>
              <Switch id="push-notifications" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                <span>Marketing Emails</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive emails about new products and features.
                </span>
              </Label>
              <Switch id="marketing-emails" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer</CardTitle>
            <CardDescription>Actions for development and testing purposes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-medium">Seed Database</h3>
                <p className="text-sm text-muted-foreground pt-1">
                    Populate your database with sample data. This includes transactions, customers, projects, and appointments.
                </p>
             </div>
             <Button onClick={handleSeedData} disabled={isPending} variant="secondary">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? 'Seeding Data...' : 'Add Sample Data'}
            </Button>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
