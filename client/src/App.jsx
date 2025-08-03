import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import NotFound from "./pages/Notfound";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Cart from "./components/Cart";

// Lazy load de páginas
const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdminProfile = lazy(() => import("./pages/AdminPorfile"));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
         <CartProvider>
            <Navbar />
            <Cart /> {/* Componente del modal del carrito */}
          <main
            style={{ paddingTop: "80px", minHeight: "calc(100vh - 160px)" }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas */}
                <Route element={<PrivateRoute />}>
                  <Route path="/profile" element={<UserProfile />} />
                </Route>

                {/* Rutas de administrador */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin-profile" element={<AdminProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  </ErrorBoundary>
  );
}
window.startTime = Date.now();

export default App;
