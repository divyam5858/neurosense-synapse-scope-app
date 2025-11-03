import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, User, Stethoscope } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      const storedUser = localStorage.getItem("neurosense_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/doctor/dashboard");
        }
      }
    }
  };

  const fillDemoCredentials = (role: "patient" | "doctor") => {
    if (role === "patient") {
      setEmail("john@example.com");
    } else {
      setEmail("alice@hospital.com");
    }
    setPassword("Demo123!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Activity className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">NeuroSense</h1>
          <p className="text-muted-foreground">Advanced Neurodegenerative Disease Risk Assessment</p>
        </div>

        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient
            </TabsTrigger>
            <TabsTrigger value="doctor" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Doctor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle>Patient Login</CardTitle>
                <CardDescription>Access your health dashboard and risk assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Demo123!"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fillDemoCredentials("patient")}
                  >
                    Use Demo Credentials
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">Demo Accounts:</p>
                  <p className="text-muted-foreground">• john@example.com / Demo123!</p>
                  <p className="text-muted-foreground">• jane@example.com / Demo123!</p>
                  <p className="text-muted-foreground">• robert@example.com / Demo123!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Login</CardTitle>
                <CardDescription>Access patient management and diagnostic tools</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="alice@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      placeholder="Demo123!"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fillDemoCredentials("doctor")}
                  >
                    Use Demo Credentials
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">Demo Accounts:</p>
                  <p className="text-muted-foreground">• alice@hospital.com / Demo123!</p>
                  <p className="text-muted-foreground">• bob@hospital.com / Demo123!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
