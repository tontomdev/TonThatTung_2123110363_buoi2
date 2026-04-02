import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function OrdersView() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/Orders`);
            const data = await res.json();
            setOrders(data);
        } catch (e) {
            console.error("Error fetching orders", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <section className="view-section active">
            <div className="page-header">
                <h1>Recent Orders</h1>
                <p>Track customer purchases</p>
            </div>
            
            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center"><div className="loader"></div></td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">No orders found.</td></tr>
                        ) : (
                            orders.map(o => {
                                const date = new Date(o.orderDate).toLocaleDateString();
                                const statusClass = o.status === 'Pending' ? 'text-warning' : (o.status === 'Completed' ? 'text-success' : '');
                                return (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>{date}</td>
                                        <td className={statusClass}><strong>{o.status}</strong></td>
                                        <td>${o.totalAmount}</td>
                                        <td className="action-btns">
                                            <button className="btn btn-sm btn-primary"><i className="fa-solid fa-eye"></i></button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
