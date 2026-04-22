import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} đ`;
const API_ORIGIN = new URL(API_BASE_URL).origin;
const resolveImageUrl = (thumbnail) => {
    if (!thumbnail) return '';
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) return thumbnail;
    return `${API_ORIGIN}${thumbnail}`;
};

export default function CustomerHomeView() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/Products`);
                if (!res.ok) throw new Error('Khong the lay menu');
                const data = await res.json();
                setMenu(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Loi tai menu khach hang:', error);
                setMenu([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    return (
        <section>
            <div className="customer-hero glass-panel">
                <h2>Chao mung den The CoffeeChill</h2>
                <p>Dat mon yeu thich cua ban chi trong vai giay.</p>
                <button className="btn btn-primary">
                    <i className="fa-solid fa-bag-shopping"></i> Bat dau dat mon
                </button>
            </div>

            <div className="customer-menu-grid mt-4">
                {loading && <p className="text-muted">Dang tai menu...</p>}
                {!loading && menu.length === 0 && <p className="text-muted">Chua co san pham hien thi.</p>}
                {!loading && menu.map((item) => (
                    <article key={item.id} className="customer-menu-card glass-panel">
                        {item.thumbnail && (
                            <img src={resolveImageUrl(item.thumbnail)} alt={item.productName} className="customer-product-photo" />
                        )}
                        <h3>{item.productName}</h3>
                        <p>{item.description || 'Mon dac biet cua quan.'}</p>
                        <div className="flex-between">
                            <strong>{formatVnd(item.price)}</strong>
                            <button className="btn btn-secondary btn-sm">Them</button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
