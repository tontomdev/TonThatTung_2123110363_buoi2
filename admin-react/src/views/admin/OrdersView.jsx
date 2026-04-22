import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import"../../App.css";
const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} đ`;

export default function OrdersView() {
const statusOptions = [
    { value: "Pending", label: "Chờ xử lý" },
    { value: "Paid", label: "Đã thanh toán" },
    { value: "Completed", label: "Hoàn thành" },
    { value: "Cancel", label: "Đã hủy" }
];
const getStatusLabel = (status) => {
    if (status === 'Pending') return 'Chờ xử lý';
    if (status === 'Paid') return 'Đã thanh toán';
    if (status === 'Completed') return 'Hoàn thành';
    if (status === 'Cancel') return 'Đã hủy';
    return status;
};
const updateStatus = async (id, status) => {
    try {
        const res = await fetch(`${API_BASE_URL}/Orders/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(status)
        });

        if (!res.ok) throw new Error("Update failed");

        fetchOrders(); // reload list
    } catch (err) {
        console.error(err);
        alert("Không cập nhật được trạng thái");
    }
};
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
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
const deleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá đơn hàng này?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/Orders/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error();

        fetchOrders();
    } catch (err) {
        alert("Xoá thất bại");
        console.error(err);
    }
};
    useEffect(() => {
        fetchOrders();
    }, []);

    return (

        <section className="view-section active">
{selectedOrder && (
    <div className="modal-overlay active">
        <div className="modal-content glass-panel">
            <div className="modal-header">
                <h2>Don hang #{selectedOrder.id}</h2>
                <button className="icon-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
                <p><b>Ngay:</b> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                <p><b>Trang thai:</b> {getStatusLabel(selectedOrder.status)}</p>
                <p><b>Tong tien:</b> {formatVnd(selectedOrder.totalAmount)}</p>
                <p><b>So mon:</b> {selectedOrder.itemsCount}</p>
                <p><b>Nguoi dat:</b> {selectedOrder.userName}</p>

                {/* 🔥 PAYMENT HIEN THI THEM */}
                <hr />

                <p><b>Thanh toan:</b></p>
                <p>Phuong thuc: {selectedOrder.payment?.method || "Chua co"}</p>
                <p>So tien: {formatVnd(selectedOrder.payment?.amount || 0)}</p>
            </div>
        </div>
    </div>
)}
            <div className="page-header">
                <h1>Don hang gan day</h1>
                <p>Theo doi lich su mua hang cua khach</p>
            </div>

            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Ma don</th>
                            <th>Ngay</th>
                            <th>Trang thai</th>
                            <th>Tong tien</th>
                            <th>Thao tac</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center"><div className="loader"></div></td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">Khong co don hang nao.</td></tr>
                        ) : (
                            orders.map(o => {
                                const date = new Date(o.orderDate).toLocaleDateString();
                                const statusClass = o.status === 'Pending' ? 'text-warning' : (o.status === 'Completed' ? 'text-success' : '');
                                return (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>{date}</td>
<td>
    <select
        value={o.status}
        onChange={(e) => updateStatus(o.id, e.target.value)}
        className={`status-select ${o.status}`}
    >
        {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
                {s.label}
            </option>
        ))}
    </select>
</td>
                                        <td>{formatVnd(o.totalAmount)}</td>
                                        <td className="action-btns">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setSelectedOrder(o)}
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button
    className="btn btn-sm btn-danger"
    onClick={() => deleteOrder(o.id)}
>
    <i className="fa fa-trash"></i>
</button>
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
