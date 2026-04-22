import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const formatVnd = (value) =>
    `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;

export default function DashboardView() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        users: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [ordersRes, productsRes, usersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/Orders`),
                fetch(`${API_BASE_URL}/Products`),
                fetch(`${API_BASE_URL}/Users`)
            ]);

            const orders = ordersRes.ok ? await ordersRes.json() : [];
            const products = productsRes.ok ? await productsRes.json() : [];
            const users = usersRes.ok ? await usersRes.json() : [];

            // =======================
            // TÍNH DOANH THU THẬT
            // chỉ tính đơn đã Paid hoặc Completed
            // =======================
            const revenue = orders
                .filter(o => o.status === "Paid" || o.status === "Completed")
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            setStats({
                revenue,
                orders: orders.length,
                products: products.length,
                users: users.length
            });

        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };

    return (
        <section className="view-section active">
            {/* HEADER */}
            <div className="page-header">
                <h1>Tổng quan</h1>
                <p>Thống kê hệ thống bán hàng</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">

                {/* DOANH THU */}
                <div className="stat-card">
                    <div className="stat-icon bg-primary-light">
                        <i className="fa-solid fa-dollar-sign text-primary"></i>
                    </div>
                    <div className="stat-details">
                        <p>Doanh thu</p>
                        <h3>{formatVnd(stats.revenue)}</h3>
                        <span className="trend up">Từ đơn đã thanh toán</span>
                    </div>
                </div>

                {/* ORDERS */}
                <div className="stat-card">
                    <div className="stat-icon bg-accent-light">
                        <i className="fa-solid fa-shopping-bag text-accent"></i>
                    </div>
                    <div className="stat-details">
                        <p>Đơn hàng</p>
                        <h3>{stats.orders}</h3>
                    </div>
                </div>

                {/* PRODUCTS */}
                <div className="stat-card">
                    <div className="stat-icon bg-success-light">
                        <i className="fa-solid fa-box text-success"></i>
                    </div>
                    <div className="stat-details">
                        <p>Sản phẩm</p>
                        <h3>{stats.products}</h3>
                    </div>
                </div>

                {/* USERS */}
                <div className="stat-card">
                    <div className="stat-icon bg-warning-light">
                        <i className="fa-solid fa-users text-warning"></i>
                    </div>
                    <div className="stat-details">
                        <p>Người dùng</p>
                        <h3>{stats.users}</h3>
                    </div>
                </div>

            </div>

            {/* INFO */}
            <div className="quick-actions-panel mt-4 glass-panel">
                <h3>Ghi chú</h3>
                <p>
                    Doanh thu chỉ tính các đơn có trạng thái <b>Paid / Completed</b>.
                </p>
            </div>
            
        </section>
    );
}