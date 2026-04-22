import React from 'react';
import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import DashboardView from './views/admin/DashboardView';
import ProductsView from './views/admin/ProductsView';
import CategoriesView from './views/admin/CategoriesView';
import OrdersView from './views/admin/OrdersView';
import UsersView from './views/admin/UsersView';
import PosView from './views/post/PosView';
import InventoryView from './views/admin/InventoryView';
import StaffView from './views/admin/StaffView';
import RevenueReportView from './views/admin/RevenueReportView';
import BaristaView from './views/barista/BaristaView';
import CustomerHomeView from './views/CustomerHomeView';
import TrackOrderView from './views/admin/TrackOrderView';
import PaymentView from './views/admin/PaymentView';
import './index.css';

function AdminLayout() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <TopNav />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-topbar">
        <h1>The CoffeeChill</h1>
        <nav>
          <NavLink to="/menu">Thuc don</NavLink>
          <NavLink to="/track-order">Theo doi don</NavLink>
          <NavLink to="/admin">Quan tri</NavLink>
        </nav>
      </header>
      <main className="public-content">
        <Outlet />
      </main>
    </div>
  );
}

function StationLayout() {
  return (
    <div className="station-layout">
      <header className="station-topbar">
        <h2>The<span className="text-accent">Coffee</span>Chill</h2>
        <nav>
          <NavLink to="/pos">POS</NavLink>
          <NavLink to="/barista">Pha che</NavLink>
          <NavLink to="/admin/dashboard">Quan tri</NavLink>
        </nav>
      </header>
      <main className="station-content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<CustomerHomeView />} />
        <Route path="/menu" element={<CustomerHomeView />} />
        <Route path="/track-order" element={<TrackOrderView />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="products" element={<ProductsView />} />
        <Route path="inventory" element={<InventoryView />} />
        <Route path="staff" element={<StaffView />} />
        <Route path="reports" element={<RevenueReportView />} />
        <Route path="orders" element={<OrdersView />} />
        <Route path="payment" element={<PaymentView />} />
        <Route path="categories" element={<CategoriesView />} />
        <Route path="users" element={<UsersView />} />
      </Route>

      <Route element={<StationLayout />}>
        <Route path="/pos" element={<PosView />} />
        <Route path="/barista" element={<BaristaView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
