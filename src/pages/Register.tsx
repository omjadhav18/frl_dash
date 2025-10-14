import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { register } from "@/utils/auth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Swal.fire({ icon: "error", title: "Full Name Required", text: "Please enter your full name" });
      return false;
    }

    if (!formData.email.trim()) {
      Swal.fire({ icon: "error", title: "Email Required", text: "Please enter your email address" });
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email address" });
      return false;
    }

    if (formData.password.length < 6) {
      Swal.fire({ icon: "error", title: "Password Too Short", text: "Password must be at least 6 characters long" });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords Don't Match", text: "Please make sure your passwords match" });
      return false;
    }

    if (!formData.agreeToTerms) {
      Swal.fire({ icon: "error", title: "Terms Required", text: "Please agree to the Terms of Service and Privacy Policy" });
      return false;
    }

    return true;
  };

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await register(formData.email, formData.fullName, formData.password);

      if (response.data && !response.error) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully!",
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.error || "Something went wrong during registration",
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };  

  // ---------------- COMPONENT JSX ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 rounded-xl gradient-primary shadow-glow w-fit">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join FedRL Dashboard and start your federated learning journey
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white"
              disabled={!formData.agreeToTerms || isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
