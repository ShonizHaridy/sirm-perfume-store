import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import Notifications from './components/Notifications'
import Loading from './components/Loading'
import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'
import AdminRoute from './components/AdminRoute'
import './App.css'

function App() {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsRTL(lng === 'ar');
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
      <Notifications />
      <Loading />
      <Header changeLanguage={changeLanguage} currentLang={i18n.language} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Public Routes which is not for authenticated users */}
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/register" element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } />
          
          {/* Private Routes */}
          <Route path="/checkout" element={
            <PrivateRoute>
              <div>Checkout Page</div> {/* You can replace with actual Checkout component */}
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <div>User Profile</div> {/* You can replace with actual Profile component */}
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App