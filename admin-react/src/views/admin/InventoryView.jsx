import React from 'react';

const STOCK_ITEMS = [
    { id: 'RM-01', name: 'Arabica Beans', unit: 'kg', inStock: 18, minStock: 12, supplier: 'Da Lat Farm' },
    { id: 'RM-02', name: 'Fresh Milk', unit: 'liter', inStock: 7, minStock: 10, supplier: 'Vinamilk' },
    { id: 'RM-03', name: 'Matcha Powder', unit: 'kg', inStock: 5, minStock: 4, supplier: 'Kyoto Matcha' },
    { id: 'RM-04', name: 'Cup 16oz', unit: 'box', inStock: 3, minStock: 6, supplier: 'Packaging VN' }
];

export default function InventoryView() {
    return (
        <section className="view-section active">
            <div className="page-header flex-between">
                <div>
                    <h1>Quan ly kho</h1>
                    <p>Theo doi ton kho va yeu cau nhap hang theo thoi gian thuc.</p>
                </div>
                <button className="btn btn-primary">
                    <i className="fa-solid fa-plus"></i> Tao phieu nhap
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-warning-light"><i className="fa-solid fa-triangle-exclamation text-warning"></i></div>
                    <div className="stat-details"><p>Mat hang sap het</p><h3>2</h3></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-success-light"><i className="fa-solid fa-boxes-stacked text-success"></i></div>
                    <div className="stat-details"><p>Tong nguyen lieu</p><h3>47</h3></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-accent-light"><i className="fa-solid fa-truck text-accent"></i></div>
                    <div className="stat-details"><p>Don dang giao</p><h3>3</h3></div>
                </div>
            </div>

            <div className="table-container glass-panel mt-4">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Ma</th>
                            <th>Nguyen lieu</th>
                            <th>Ton kho</th>
                            <th>Muc toi thieu</th>
                            <th>Trang thai</th>
                            <th>Nha cung cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {STOCK_ITEMS.map((item) => {
                            const isLow = item.inStock < item.minStock;
                            return (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td><strong>{item.name}</strong></td>
                                    <td>{item.inStock} {item.unit}</td>
                                    <td>{item.minStock} {item.unit}</td>
                                    <td className={isLow ? 'text-warning' : 'text-success'}>
                                        <strong>{isLow ? 'Can nhap them' : 'On dinh'}</strong>
                                    </td>
                                    <td>{item.supplier}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
