import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config";

const formatVnd = (v) =>
    `${new Intl.NumberFormat("vi-VN").format(Number(v) || 0)} đ`;

export default function RevenueReportView() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await fetch(`${API_BASE_URL}/Orders`);
        const data = await res.json();
        setOrders(data || []);
    };

    // =========================
    // FILTER VALID ORDERS
    // =========================
    const validOrders = useMemo(() => {
        return orders.filter(
            o => o.status === "Paid" || o.status === "Completed"
        );
    }, [orders]);

    // =========================
    // TODAY REVENUE
    // =========================
    const todayRevenue = useMemo(() => {
        const today = new Date().toDateString();

        return validOrders
            .filter(o => new Date(o.orderDate).toDateString() === today)
            .reduce((s, o) => s + o.totalAmount, 0);
    }, [validOrders]);

    // =========================
    // TOTAL REVENUE
    // =========================
    const totalRevenue = useMemo(() => {
        return validOrders.reduce((s, o) => s + o.totalAmount, 0);
    }, [validOrders]);

    // =========================
    // LAST 7 DAYS GROUP
    // =========================
    const weeklyData = useMemo(() => {
        const map = {};

        const now = new Date();
        const last7 = new Date();
        last7.setDate(now.getDate() - 6);

        validOrders.forEach(o => {
            const d = new Date(o.orderDate);

            if (d >= last7 && d <= now) {
                const key = d.toLocaleDateString("vi-VN");

                if (!map[key]) map[key] = 0;
                map[key] += o.totalAmount;
            }
        });

        return Object.entries(map).map(([day, revenue]) => ({
            day,
            revenue: revenue / 1000000
        }));
    }, [validOrders]);

    const max = Math.max(...weeklyData.map(x => x.revenue), 1);

    // =========================
    // AVG ORDER VALUE
    // =========================
    const avgOrder =
        validOrders.length === 0
            ? 0
            : totalRevenue / validOrders.length;

    return (
        <section className="view-section active">
            {/* HEADER */}
            <div className="page-header">
                <h1>📊 Báo cáo doanh thu nâng cao</h1>
                <p>Phân tích dữ liệu bán hàng realtime từ hệ thống</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon bg-primary-light">
                        💰
                    </div>
                    <div className="stat-details">
                        <p>Doanh thu hôm nay</p>
                        <h3>{formatVnd(todayRevenue)}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-success-light">
                        📈
                    </div>
                    <div className="stat-details">
                        <p>Tổng doanh thu</p>
                        <h3>{formatVnd(totalRevenue)}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-accent-light">
                        🧾
                    </div>
                    <div className="stat-details">
                        <p>Đơn hợp lệ</p>
                        <h3>{validOrders.length}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-warning-light">
                        📦
                    </div>
                    <div className="stat-details">
                        <p>Giá trị TB / đơn</p>
                        <h3>{formatVnd(avgOrder)}</h3>
                    </div>
                </div>

            </div>

            {/* CHART */}
            <div className="glass-panel mt-4">
                <h3>Doanh thu 7 ngày gần nhất</h3>

                <div className="mini-chart">
                    {weeklyData.map((row) => (
                        <div key={row.day} className="mini-chart-col">
                            <div className="mini-chart-bar-wrap">
                                <div
                                    className="mini-chart-bar"
                                    style={{
                                        height: `${(row.revenue / max) * 180}px`
                                    }}
                                />
                            </div>
                            <strong>{row.day}</strong>
                            <span>{row.revenue.toFixed(1)}M</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}