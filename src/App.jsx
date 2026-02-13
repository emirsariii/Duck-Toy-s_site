import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import CheckoutAddress from './pages/CheckoutAddress';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
// YENİ SAYFALAR
import BestSellers from './pages/BestSellers';
import MostCommented from './pages/MostCommented';
import About from './pages/About';
import Help from './pages/Help';
import OrderTracking from './pages/OrderTracking';

import './App.css';

function Layout() {
  const location = useLocation();
  // Admin sayfasında Navbar ve Footer görünmesin
  const showNavbar = location.pathname !== '/admin';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* ÖDEME ADIMLARI */}
        <Route path="/checkout" element={<CheckoutAddress />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* YENİ EKLENEN ÖZEL SAYFALAR */}
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/most-commented" element={<MostCommented />} />

        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/track-order" element={<OrderTracking />} />
      </Routes>
      {showNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;