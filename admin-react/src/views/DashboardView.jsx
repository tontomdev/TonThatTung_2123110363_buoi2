import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function DashboardView() {
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        users: 0
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/Orders`),
                    fetch(`${API_BASE_URL}/Products`),
                    fetch(`${API_BASE_URL}/Users`)
                ]);
                
                let oCount = stats.orders, pCount = stats.products, uCount = stats.users;
                if(ordersRes.ok) { const data = await ordersRes.json(); oCount = data.length; }
                if(productsRes.ok) { const data = await productsRes.json(); pCount = data.length; }
                if(usersRes.ok) { const data = await usersRes.json(); uCount = data.length; }

                setStats({ orders: oCount, products: pCount, users: uCount });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        }
        fetchStats();
    }, []);

    return (
        <section className="view-section active">
            <div className="page-header">
                <h1>Overview</h1>
                <p>Welcome back, here's what's happening today.</p>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-primary-light">
                        <i className="fa-solid fa-dollar-sign text-primary"></i>
                    </div>
                    <div className="stat-details">
                        <p>Total Revenue</p>
                        <h3>$24,562</h3>
                        <span className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> 12.5%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-accent-light">
                        <i className="fa-solid fa-shopping-bag text-accent"></i>
                    </div>
                    <div className="stat-details">
                        <p>Total Orders</p>
                        <h3>{stats.orders}</h3>
                        <span className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> 8.2%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-success-light">
                        <i className="fa-solid fa-box text-success"></i>
                    </div>
                    <div className="stat-details">
                        <p>Products</p>
                        <h3>{stats.products}</h3>
                        <span className="trend neutral"><i className="fa-solid fa-minus"></i> 0.0%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-warning-light">
                        <i className="fa-solid fa-users text-warning"></i>
                    </div>
                    <div className="stat-details">
                        <p>Customers</p>
                        <h3>{stats.users}</h3>
                        <span className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> 5.1%</span>
                    </div>
                </div>
            </div>

            <div className="quick-actions-panel mt-4 glass-panel">
                <h3>Quick Notice</h3>
                <p>Select a category from the sidebar to start managing your store data.</p>
            </div>
        </section>
    );
}
