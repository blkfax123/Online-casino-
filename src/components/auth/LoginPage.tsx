import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Wallet, Zap, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithWallet } = useAuth();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to NeonBet Casino",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    
    // Simulate MetaMask connection
    try {
      // In real app, you'd use: await window.ethereum.request({ method: 'eth_requestAccounts' })
      const mockWalletAddress = '0x742d35Cc6e827C6C1C6d6e24e8C4b0A8b3F8D2C9';
      const success = await loginWithWallet(mockWalletAddress);
      
      if (success) {
        toast({
          title: "Wallet connected!",
          description: "Successfully connected your crypto wallet",
        });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-bounce-subtle" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-casino rounded-xl flex items-center justify-center shadow-neon-primary">
              <Zap className="w-6 h-6 text-white animate-glow" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-casino bg-clip-text text-transparent">
              NeonBet
            </h1>
          </div>
          <p className="text-muted-foreground">
            Premium Crypto Casino Experience
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-glass border-card-border shadow-glass">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or connect your wallet
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="wallet" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4 mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-input/50 border-card-border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 bg-input/50 border-card-border"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="neon"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="wallet" className="space-y-4 mt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                    <Wallet className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use MetaMask, WalletConnect, or any compatible wallet
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleWalletConnect}
                    variant="casino"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features showcase */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="space-y-2">
            <Shield className="w-6 h-6 text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">Provably Fair</p>
          </div>
          <div className="space-y-2">
            <TrendingUp className="w-6 h-6 text-secondary mx-auto" />
            <p className="text-xs text-muted-foreground">High RTP</p>
          </div>
          <div className="space-y-2">
            <Zap className="w-6 h-6 text-accent mx-auto" />
            <p className="text-xs text-muted-foreground">Instant Payouts</p>
          </div>
        </div>
      </div>
    </div>
  );
};