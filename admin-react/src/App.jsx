import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import DashboardView from './views/DashboardView';
import ProductsView from './views/ProductsView';
import CategoriesView from './views/CategoriesView';
import OrdersView from './views/OrdersView';
import UsersView from './views/UsersView';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'products': return <ProductsView />;
      case 'categories': return <CategoriesView />;
      case 'orders': return <OrdersView />;
      case 'users': return <UsersView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        <TopNav />
        <div className="content-wrapper">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
