import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import {
  ActionPlans,
  Assessments,
  Dashboard,
  Docs,
  HowItWorks,
  Landing,
  News,
  NotFound,
  Onboarding,
  Signin,
  Signup,
  SkillGaps,
} from "./pages";
import { AuthHeader, Breadcrumb, Footer, Header, SideBar } from "./components";
import { useAuth } from "./contexts/AuthContext";
import { useOnboarding } from "./contexts/OnboardingContext";

const AuthLayout = () => {
  return (
    <section className="min-h-screen flex flex-col bg-[#0E131C] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[48px_48px]">
      <AuthHeader />
      <Outlet />
    </section>
  );
};

const PublicLayout = () => {
  return (
    <section className="min-h-screen flex flex-col bg-[#0E131C]">
      <Header />
      <div className="flex-1 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[48px_48px]">
        <Outlet />
      </div>
      <Footer />
    </section>
  );
};

const PrivateLayout = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isOnboardingComplete, loading: onboardingLoading } = useOnboarding();

  if (authLoading || onboardingLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Pages that should not show sidebar
  const hideSidebarPaths = ["/profile", "/help", "/notifications"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="bg-[#0E131C] h-screen flex flex-col overflow-hidden">
      <Breadcrumb />
      <div className="flex flex-1 overflow-hidden">
        {shouldShowSidebar && <SideBar />}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const OnboardingRoute = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isOnboardingComplete, loading: onboardingLoading } = useOnboarding();

  if (authLoading || onboardingLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (isOnboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Onboarding />;
};

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/news" element={<News />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Onboarding route with its own logic */}
      <Route path="/onboarding" element={<OnboardingRoute />} />

      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/skill-gaps" element={<SkillGaps />} />
        <Route path="/action-plans" element={<ActionPlans />} />
      </Route>
    </Routes>
  );
};

export default App;
