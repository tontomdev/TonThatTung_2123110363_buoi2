import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function CategoriesView() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: '', categoryName: '', description: '' });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/Categoris`); // the typo in controller
            const data = await res.json();
            setCategories(data);
        } catch (e) {
            console.error("Error fetching categories", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            categoryName: formData.categoryName, 
            description: formData.description 
        };
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id ? `${API_BASE_URL}/Categoris/${formData.id}` : `${API_BASE_URL}/Categoris`;
        
        if (formData.id) payload.id = parseInt(formData.id);

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            setShowModal(false);
            setFormData({ id: '', categoryName: '', description: '' });
            fetchCategories();
        } catch (err) {
            alert('Error saving category');
        }
    };

    const editCategory = (cat) => {
        setFormData({ id: cat.id, categoryName: cat.categoryName, description: cat.description || '' });
        setShowModal(true);
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            await fetch(`${API_BASE_URL}/Categoris/${id}`, { method: 'DELETE' });
            fetchCategories();
        }
    };

    return (
        <section className="view-section active">
            <div className="page-header flex-between">
                <div>
                    <h1>Categories</h1>
                    <p>Manage product categories</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setFormData({ id: '', categoryName: '', description: '' }); setShowModal(true); }}>
                    <i className="fa-solid fa-plus"></i> Add Category
                </button>
            </div>
            
            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center"><div className="loader"></div></td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="4" className="text-center text-muted">No categories found.</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>#{cat.id}</td>
                                    <td><strong>{cat.categoryName}</strong></td>
                                    <td>{cat.description || '-'}</td>
                                    <td className="action-btns">
                                        <button className="btn btn-sm btn-warning" onClick={() => editCategory(cat)}><i className="fa-solid fa-pen"></i></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat.id)}><i className="fa-solid fa-trash"></i></button>
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
                            <h2>{formData.id ? 'Edit Category' : 'Add Category'}</h2>
                            <button className="icon-btn close-modal" onClick={() => setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Category Name</label>
                                    <input type="text" required className="form-control" placeholder="E.g. Footwear" 
                                        value={formData.categoryName} onChange={e => setFormData({...formData, categoryName: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-control" placeholder="Short description..." 
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
