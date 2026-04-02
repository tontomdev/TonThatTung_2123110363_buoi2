import React from 'react';

export default function Sidebar({ currentView, setCurrentView }) {
    const navItems = [
        { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'products', icon: 'fa-box-open', label: 'Products' },
        { id: 'categories', icon: 'fa-layer-group', label: 'Categories' },
        { id: 'orders', icon: 'fa-cart-shopping', label: 'Orders' },
        { id: 'users', icon: 'fa-users', label: 'Users' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fa-solid fa-bolt text-accent"></i>
                <h2>Pro<span className="text-accent">Sports</span></h2>
            </div>
            
            <ul className="nav-links">
                {navItems.map(item => (
                    <li 
                        key={item.id} 
                        className={currentView === item.id ? 'active' : ''}
                        onClick={() => setCurrentView(item.id)}
                    >
                        <i className={`fa-solid ${item.icon}`}></i> {item.label}
                    </li>
                ))}
            </ul>

            <div className="sidebar-footer">
                <div className="user-info">
                    <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="avatar" />
                    <div>
                        <h4>Admin User</h4>
                        <p>Superadmin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
