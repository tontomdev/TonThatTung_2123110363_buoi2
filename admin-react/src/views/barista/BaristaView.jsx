import React, { useEffect, useState } from 'react';
import { getOrderQueue, subscribeOrderUpdates, updateOrderStatus } from '../../utils/orderSync';

const STATUS_COLUMNS = ['Cho', 'Dang lam', 'Hoan thanh'];

export default function BaristaView() {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        setQueue(getOrderQueue());
        return subscribeOrderUpdates(setQueue);
    }, []);

    const moveStatus = (id, nextStatus) => {
        updateOrderStatus(id, nextStatus);
    };

    return (
        <section className="view-section active">
            <div className="page-header">
                <h1>Man hinh pha che</h1>
                <p>Hang doi realtime: Cho → Dang lam → Hoan thanh</p>
            </div>

            <div className="barista-board">
                {STATUS_COLUMNS.map((col) => (
                    <div key={col} className="barista-column glass-panel">
                        <div className="barista-column-head">
                            <h3>{col}</h3>
                            <span>{queue.filter((x) => x.status === col).length}</span>
                        </div>

                        <div className="barista-list">
                            {queue.filter((x) => x.status === col).length === 0 && (
                                <p className="text-muted">Chua co don</p>
                            )}
                            {queue.filter((x) => x.status === col).map((order) => (
                                <div key={order.id} className="barista-card">
                                    <p><strong>#{order.code}</strong> - {order.table}</p>
                                    <h4>{Array.isArray(order.items) ? order.items.map((x) => `${x.name} x${x.qty}`).join(', ') : ''}</h4>
                                    <div className="barista-actions">
                                        {col === 'Cho' && (
                                            <button className="btn btn-sm btn-warning" onClick={() => moveStatus(order.id, 'Dang lam')}>Bat dau</button>
                                        )}
                                        {col === 'Dang lam' && (
                                            <button className="btn btn-sm btn-primary" onClick={() => moveStatus(order.id, 'Hoan thanh')}>Xong</button>
                                        )}
                                        {col === 'Hoan thanh' && (
                                            <button className="btn btn-sm btn-secondary" onClick={() => moveStatus(order.id, 'Cho')}>Mo lai</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
