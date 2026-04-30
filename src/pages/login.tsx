import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, UserPlus, MapPin, Phone, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import loginHero from "@/assets/login-hero.jpg";
import logoIcon from "@/assets/logo-cc.png";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@chauhaan.com", password: "admin123" },
  { label: "Telecaller", email: "telecaller@chauhaan.com", password: "tele123" },
  { label: "Customer", email: "customer@chauhaan.com", password: "cust123" },
];

export default function Login() {
  const { signIn, signUp, user, role, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user && role) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "telecaller") return <Navigate to="/telecaller" replace />;
    return <Navigate to="/customer" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (phone.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    setSubmitting(true);
    const { error: err } = await signUp(email, password, fullName, "customer", phone);
    if (err) {
      setError(err.message);
    } else {
      setSuccess("Account created! Please sign in to continue.");
      setMode("login");
    }
    setSubmitting(false);
  };

  const fillDemo = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
    setSuccess("");
    setMode("login");
  };

  const switchMode = (m: "login" | "signup") => {
    setMode(m);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] flex relative overflow-hidden">
      {/* Immersive Dynamic Gradient Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[130px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-[110px]" 
      />
      <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[90px]" />
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

      {/* Left — Hero image (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginHero}
          alt="Chauhan Computers store"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/95 via-slate-900/70 to-primary/30" />
        <div className="relative z-10 flex flex-col justify-end p-20 text-white w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden">
                <img src={logoIcon} alt="CC" className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Chauhan Computers</h2>
                <div className="h-1 w-12 bg-primary mt-1 rounded-full" />
              </div>
            </div>
            <p className="text-xl text-white/80 mb-8 max-w-md font-medium leading-relaxed">
              Elevating Jaipur's IT infrastructure since 2010. Your premium destination for enterprise hardware and service.
            </p>
            <div className="flex flex-col gap-4 text-sm text-white/70">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Shop No B-5, Vaibhav Enclave, Girdhar Marg, Malviya Nagar, Jaipur</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 98297 21157</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right — Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Header Area */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 lg:hidden">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black text-slate-900 lg:hidden">Chauhan Computers</h1>
            </div>
            <Link to="/" className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Home
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-white/50 bg-gradient-to-b from-white to-blue-50/30">
            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl mb-10 border border-slate-200/50">
              <button
                onClick={() => switchMode("login")}
                className={`flex-1 py-3 rounded-[1.125rem] text-sm font-bold transition-all ${
                  mode === "login"
                    ? "bg-white text-primary shadow-xl shadow-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode("signup")}
                className={`flex-1 py-3 rounded-[1.125rem] text-sm font-bold transition-all ${
                  mode === "signup"
                    ? "bg-white text-primary shadow-xl shadow-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="mb-8 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-sm font-medium text-slate-500 mt-2">Secure access to your enterprise dashboard</p>
                  </div>

                  {/* Demo Account Pills */}
                  <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Quick Access</p>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_ACCOUNTS.map((demo) => (
                        <button
                          key={demo.label}
                          type="button"
                          onClick={() => fillDemo(demo)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            email === demo.email
                              ? "bg-gradient-to-r from-primary to-blue-600 text-white border-transparent shadow-lg shadow-primary/20"
                              : "bg-white border-slate-200 text-slate-600 hover:border-primary/30"
                          }`}
                        >
                          {demo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 px-1">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-slate-400"
                          placeholder="name@company.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 px-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-slate-400 pr-12"
                          placeholder="••••••••"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-rose-500 px-1">{error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-emerald-500 px-1">{success}</motion.p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          Sign In
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="mb-8 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-slate-900">Get Started</h2>
                    <p className="text-sm font-medium text-slate-500 mt-2">Join our premium IT ecosystem</p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 px-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 px-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 px-1">Mobile Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all pl-12"
                          placeholder="98765 43210"
                          required
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                          +91
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 px-1">Create Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all pr-12"
                          placeholder="Min. 6 characters"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Create Account
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure AES-256</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Terms & Privacy apply
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
