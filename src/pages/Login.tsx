import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@chauhaan.com", password: "admin123", role: "admin" as const },
  { label: "Telecaller", email: "telecaller@chauhaan.com", password: "tele123", role: "telecaller" as const },
  { label: "Customer", email: "customer@chauhaan.com", password: "cust123", role: "customer" as const },
];

export default function Login() {
  const { signIn, user, role, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user && role) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "telecaller") return <Navigate to="/telecaller" replace />;
    return <Navigate to="/customer" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setSubmitting(false);
  };

  const fillDemo = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 shadow-elevated">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Chauhaan Computers</span>
            </div>
            <p className="text-sm text-muted-foreground">Your Trusted Tech Partner</p>
          </div>

          {/* Demo login buttons */}
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => fillDemo(demo)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    email === demo.email
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 border border-border pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Contact admin for account creation
          </p>
        </div>
      </motion.div>
    </div>
  );
}
