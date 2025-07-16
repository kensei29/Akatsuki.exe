"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { Github, Mail, BookOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { state, loginUser, registerUser } = useApp();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    college: "",
    year: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      // Error is handled in AppContext and displayed via state.error
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({
        email: formData.email,
        name: formData.fullName,
        college: formData.college,
        year: formData.year
          ? parseInt(formData.year.replace(/\D/g, ""))
          : undefined,
        password: formData.password,
      });
      router.push("/dashboard");
    } catch (error) {
      // Error is handled in AppContext and displayed via state.error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            CS Academy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Your gateway to Computer Science excellence
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Join thousands of CS students in their learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {state.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@college.edu"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={state.loading}
                  >
                    {state.loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Alex Johnson"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@college.edu"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-college">College</Label>
                    <Input
                      id="register-college"
                      type="text"
                      placeholder="Your College Name"
                      value={formData.college}
                      onChange={(e) =>
                        handleInputChange("college", e.target.value)
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-year">Academic Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) =>
                        handleInputChange("year", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                        <SelectItem value="mtech">M.Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={state.loading}
                  >
                    {state.loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
