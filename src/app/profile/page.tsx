import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your personal information and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">Shad CN</h2>
                <p className="text-muted-foreground">ui@shadcn.com</p>
                <div className="flex items-center justify-center gap-2 md:justify-start">
                    <Badge variant="outline">Pro User</Badge>
                    <p className="text-sm text-muted-foreground">Joined on January 15, 2024</p>
                </div>
              </div>
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <h3 className="font-medium">Role</h3>
                        <p className="text-muted-foreground">Lead Designer</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Team</h3>
                        <p className="text-muted-foreground">Product Team</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-muted-foreground">San Francisco, CA</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-medium">Bio</h3>
                    <p className="text-muted-foreground">A passionate designer focused on creating intuitive and beautiful user interfaces. Loves to work at the intersection of design and technology.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
