import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} đ`;
const API_ORIGIN = new URL(API_BASE_URL).origin;
const resolveImageUrl = (thumbnail) => {
    if (!thumbnail) return '';
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) return thumbnail;
    return `${API_ORIGIN}${thumbnail}`;
};

export default function ProductsView() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Initial form data matches ASP.NET Product model
    const initialFormState = { id: null, productName: '', price: '', quantity: '', categoryId: '', description: '', imageFile: null, thumbnail: '' };
    const [formData, setFormData] = useState(initialFormState);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${API_BASE_URL}/Products`),
                fetch(`${API_BASE_URL}/Categoris`)
            ]);

            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (e) {
            console.error("Error fetching data", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("ProductName", formData.productName);
        form.append("Price", formData.price);
        form.append("Quantity", formData.quantity);
        form.append("CategoryId", formData.categoryId);
        form.append("Description", formData.description);
        if (formData.imageFile) form.append("ImageFile", formData.imageFile);

        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `${API_BASE_URL}/Products/${formData.id}`
            : `${API_BASE_URL}/Products`;

        try {
            const res = await fetch(url, {
                method,
                body: form // ❗ KHÔNG set Content-Type
            });

            const data = await res.json();
            console.log("Saved:", data);

            setShowModal(false);
            setFormData(initialFormState);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Loi khi luu san pham');
        }
    };

    const editProduct = (p) => {
        setFormData({
            id: p.id,
            productName: p.productName,
            price: p.price,
            quantity: p.quantity,
            categoryId: p.categoryId,
            description: p.description || '',
            imageFile: null,
            thumbnail: p.thumbnail || ''
        });
        setShowModal(true);
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Ban co chac muon xoa san pham nay?')) {
            await fetch(`${API_BASE_URL}/Products/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const getCatName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.categoryName : id;
    };

    return (
        <section className="view-section active">
            <div className="page-header flex-between">
                <div>
                    <h1>San pham</h1>
                    <p>Quan ly san pham trong cua hang</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setFormData(initialFormState); setShowModal(true); }}>
                    <i className="fa-solid fa-plus"></i> Them san pham
                </button>
            </div>

            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hinh</th>
                            <th>Ten</th>
                            <th>Gia & So luong</th>
                            <th>Thao tac</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center"><div className="loader"></div></td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">Khong co san pham nao.</td></tr>
                        ) : (
                            products.map(p => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>
                                        {p.thumbnail ? (
                                            <img src={resolveImageUrl(p.thumbnail)} alt={p.productName} className="table-thumb" />
                                        ) : (
                                            <span className="text-muted">Khong co</span>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{p.productName}</strong><br />
                                        <small className="text-muted">Danh muc: {getCatName(p.categoryId)}</small>
                                    </td>
                                    <td>
                                        {formatVnd(p.price)} <br />
                                        <small className="text-success">So luong: {p.quantity}</small>
                                    </td>
                                    <td className="action-btns">
                                        <button className="btn btn-sm btn-warning" onClick={() => editProduct(p)}><i className="fa-solid fa-pen"></i></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay active">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h2>{formData.id ? 'Sua san pham' : 'Them san pham'}</h2>
                            <button className="icon-btn close-modal" onClick={() => setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Ten san pham</label>
                                    <input type="text" required className="form-control" placeholder="VD: Ca phe sua"
                                        value={formData.productName} onChange={e => setFormData({ ...formData, productName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Gia (VND)</label>
                                    <input type="number" step="0.01" required className="form-control" placeholder="99.99"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>So luong</label>
                                    <input type="number" required className="form-control" placeholder="100"
                                        value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Danh muc</label>
                                    <select required className="form-control" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                                        <option value="">-- Chon danh muc --</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Mo ta</label>
                                    <textarea className="form-control" placeholder="Nhap mo ta..."
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Hinh san pham</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={e => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                                    />
                                    {(formData.imageFile || formData.thumbnail) && (
                                        <img
                                            src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : resolveImageUrl(formData.thumbnail)}
                                            alt="Xem truoc"
                                            className="form-image-preview"
                                        />
                                    )}
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Huy</button>
                                    <button type="submit" className="btn btn-primary">Luu san pham</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
