import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const formatVnd = (v) =>
    new Intl.NumberFormat("vi-VN").format(Number(v) || 0) + " đ";

export default function PaymentView() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/Payment`);
                const data = await res.json();
                setPayments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="view-section active">
            <div className="page-header">
                <div>
                    <h1>Thanh toán</h1>
                    <p>Lịch sử giao dịch POS</p>
                </div>
            </div>

            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Phương thức</th>
                            <th>Số tiền</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Chưa có thanh toán
                                </td>
                            </tr>
                        ) : (
                            payments.map(p => (
                                <tr key={p.id}>
                                    <td>#{p.orderId}</td>
                                    <td>{p.method}</td>
                                    <td>{formatVnd(p.amount)}</td>
  
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}