'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';

// Hardcoded correct password for the prototype
const CORRECT_PASSWORD = 'password123';

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [isWrongPassword, setIsWrongPassword] = useState(true);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const isIncorrect = newPassword !== CORRECT_PASSWORD;
    setIsWrongPassword(isIncorrect);
    
    // If password becomes correct, reset the button's position
    if (!isIncorrect) {
      setTransform({ x: 0, y: 0 });
    }
  };

  const handleButtonHover = () => {
    if (isWrongPassword) {
      // Calculate a random position within a certain range to move the button
      const newX = (Math.random() - 0.5) * 250; 
      const newY = (Math.random() - 0.5) * 60; 
      setTransform({ x: newX, y: newY });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isWrongPassword) {
      onLoginSuccess();
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm overflow-hidden">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Logo className="size-8 text-primary" />
          </div>
          <CardTitle>Welcome to BizSight</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" defaultValue="user@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Hint: password123"
                value={password}
                onChange={handlePasswordChange}
                required 
              />
            </div>
          </CardContent>
          <CardFooter>
            {/* This container needs enough space for the button to move around */}
            <div className="flex h-24 w-full items-center justify-center">
                 <Button
                    type="submit"
                    onMouseEnter={handleButtonHover}
                    style={{ 
                        transform: `translate(${transform.x}px, ${transform.y}px)`,
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    Login
                </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
