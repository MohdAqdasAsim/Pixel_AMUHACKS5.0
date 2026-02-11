import { Outlet, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Docs,
  HowItWorks,
  Landing,
  News,
  NotFound,
  Signin,
  Signup,
} from "./pages";
import { Footer, Header } from "./components";

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-[#0E131C]">
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
  return (
    <section className="min-h-screen bg-[#0E131C]">
      <Outlet />
    </section>
  );
};

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index path="/" element={<Landing />} />

        <Route path="/docs" element={<Docs />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/howitworks" element={<News />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
