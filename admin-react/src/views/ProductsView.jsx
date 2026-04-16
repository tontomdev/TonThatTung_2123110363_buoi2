import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function ProductsView() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Initial form data matches ASP.NET Product model
    const initialFormState = { id: null, productName: '', price: '', quantity: '', categoryId: '', description: '' };
    const [formData, setFormData] = useState(initialFormState);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${API_BASE_URL}/Products`),
                fetch(`${API_BASE_URL}/Categoris`)
            ]);
            
            if(prodRes.ok) setProducts(await prodRes.json());
            if(catRes.ok) setCategories(await catRes.json());
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
        alert('Error saving product');
    }
};

    const editProduct = (p) => {
        setFormData({ 
            id: p.id, 
            productName: p.productName, 
            price: p.price,
            quantity: p.quantity,
            categoryId: p.categoryId,
            description: p.description || '' 
        });
        setShowModal(true);
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
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
                    <h1>Products</h1>
                    <p>Manage store inventory</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setFormData(initialFormState); setShowModal(true); }}>
                    <i className="fa-solid fa-plus"></i> Add Product
                </button>
            </div>
            
            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price & Qty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center"><div className="loader"></div></td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="4" className="text-center text-muted">No products found.</td></tr>
                        ) : (
                            products.map(p => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>
                                        <strong>{p.productName}</strong><br/>
                                        <small className="text-muted">Cat: {getCatName(p.categoryId)}</small>
                                    </td>
                                    <td>
                                        ${p.price} <br/>
                                        <small className="text-success">Qty: {p.quantity}</small>
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
                            <h2>{formData.id ? 'Edit Product' : 'Add Product'}</h2>
                            <button className="icon-btn close-modal" onClick={() => setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" required className="form-control" placeholder="E.g. Nike Air Max" 
                                        value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input type="number" step="0.01" required className="form-control" placeholder="99.99"
                                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input type="number" required className="form-control" placeholder="100"
                                        value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select required className="form-control" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                                        <option value="">-- Select Category --</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-control" placeholder="Details..." 
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
