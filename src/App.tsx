import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StoreInfoBar } from "@/components/StoreInfoBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";
import Index from "./pages/index";
import Category from "./pages/category";
import ProductDetail from "./pages/productdetail";
import Cart from "./pages/cart";
import About from "./pages/about";
import Services from "./pages/services";
import Blog from "./pages/blog";
import Contact from "./pages/contact";
import Careers from "./pages/careers";
import Login from "./pages/login";
import NotFound from "./pages/notfound";
import AdminLayout from "./pages/admin/adminlayout";
import AdminDashboard from "./pages/admin/admindashboard";
import AdminLeads from "./pages/admin/adminleads";
import AdminProducts from "./pages/admin/adminproducts";
import AdminTelecallers from "./pages/admin/admintelecallers";
import AdminReports from "./pages/admin/adminreports";
import AdminSettings from "./pages/admin/adminsettings";
import AdminBanners from "./pages/admin/adminbanners";
import AdminSocialMedia from "./pages/admin/adminsocialmedia";
import AdminMessages from "./pages/admin/adminmessages";
import AdminUsers from "./pages/admin/adminusers";
import AdminWebsite from "./pages/admin/adminwebsite";
import AdminCategories from "./pages/admin/admincategories";
import AdminTestimonials from "./pages/admin/admintestimonials";
import AdminServices from "./pages/admin/adminservices";
import AdminCareers from "./pages/admin/admincareers";
import TelecallerLayout from "./pages/telecaller/telecallerlayout";
import TelecallerLeads from "./pages/telecaller/telecallerleads";
import TelecallerCalls from "./pages/telecaller/telecallercalls";
import TelecallerFollowups from "./pages/telecaller/telecallerfollowups";
import TelecallerPerformance from "./pages/telecaller/telecallerperformance";
import CustomerLayout from "./pages/customer/customerlayout";
import CustomerHome from "./pages/customer/customerhome";
import CustomerProducts from "./pages/customer/customerproducts";
import CustomerEnquiries from "./pages/customer/customerenquiries";
import CustomerQuote from "./pages/customer/customerquote";
import CustomerProfile from "./pages/customer/customerprofile";

const queryClient = new QueryClient();

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreInfoBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const App = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('/version.json?t=' + Date.now());
        const data = await response.json();
        const currentVersion = localStorage.getItem('app_version');
        const lastReload = localStorage.getItem('last_version_reload');
        const now = Date.now();

        // Only attempt reload if version mismatch AND we haven't reloaded in the last 5 minutes
        if (currentVersion && currentVersion !== data.version) {
          const fiveMinutes = 5 * 60 * 1000;
          if (!lastReload || (now - parseInt(lastReload)) > fiveMinutes) {
            console.log('Safe reload: New version detected');
            localStorage.setItem('app_version', data.version);
            localStorage.setItem('last_version_reload', now.toString());
            window.location.reload();
          }
        } else if (!currentVersion) {
          localStorage.setItem('app_version', data.version);
        }
      } catch (e) {
        // Silently fail to not disturb user
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              {/* Public storefront */}
              <Route path="/" element={<StorefrontLayout><Index /></StorefrontLayout>} />
              <Route path="/category/:slug" element={<StorefrontLayout><Category /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
              <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
              <Route path="/services" element={<StorefrontLayout><Services /></StorefrontLayout>} />
              <Route path="/blog" element={<StorefrontLayout><Blog /></StorefrontLayout>} />
              <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
              <Route path="/careers" element={<StorefrontLayout><Careers /></StorefrontLayout>} />
              <Route path="/login" element={<Login />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="telecallers" element={<AdminTelecallers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="social" element={<AdminSocialMedia />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="website" element={<AdminWebsite />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="careers" element={<AdminCareers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Telecaller Panel */}
              <Route path="/telecaller" element={<ProtectedRoute allowedRoles={["telecaller"]}><TelecallerLayout /></ProtectedRoute>}>
                <Route index element={<TelecallerLeads />} />
                <Route path="calls" element={<TelecallerCalls />} />
                <Route path="followups" element={<TelecallerFollowups />} />
                <Route path="performance" element={<TelecallerPerformance />} />
              </Route>

              {/* Customer Panel */}
              <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerLayout /></ProtectedRoute>}>
                <Route index element={<CustomerHome />} />
                <Route path="products" element={<CustomerProducts />} />
                <Route path="enquiries" element={<CustomerEnquiries />} />
                <Route path="quote" element={<CustomerQuote />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
