import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const navItems = [
        { to: '/admin/dashboard', icon: 'fa-chart-line', label: 'Tong quan' },
        { to: '/admin/products', icon: 'fa-box-open', label: 'San pham' },
       // { to: '/admin/inventory', icon: 'fa-warehouse', label: 'Kho hang' },
        { to: '/admin/staff', icon: 'fa-user-tie', label: 'Nhan vien' },
        { to: '/admin/reports', icon: 'fa-chart-column', label: 'Bao cao doanh thu' },
        { to: '/admin/orders', icon: 'fa-cart-shopping', label: 'Don hang' },
        { to: '/admin/categories', icon: 'fa-layer-group', label: 'Danh muc' },
        { to: '/admin/users', icon: 'fa-users', label: 'Tai khoan' },
        { to: '/admin/payment', icon: 'fa-credit-card', label: 'Thanh toan' },
        { to: '/pos', icon: 'fa-cash-register', label: 'Quay thu ngan POS' },
        { to: '/barista', icon: 'fa-mug-hot', label: 'Man hinh pha che' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fa-solid fa-bolt text-accent"></i>
                <h2>The<span className="text-accent">Coffee</span>Chill</h2>
            </div>

            <ul className="nav-links">
                {navItems.map(item => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                        >
                            <i className={`fa-solid ${item.icon}`}></i> {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="sidebar-footer">
                <div className="user-info">
                    <img src="https://i.pravatar.cc/150?u=admin" alt="Quan tri" className="avatar" />
                    <div>
                        <h4>Quan tri vien</h4>
                        <p>Quan tri he thong</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
