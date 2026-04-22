import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function UsersView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const fetchRoles = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/Role`);
            const data = await res.json();
            setRoles(data);
        } catch (err) {
            console.error("Error fetching roles", err);
        }
    };
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/Users`);
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error("Error fetching users", e);
        }
        setLoading(false);
    };
    const [showModal, setShowModal] = useState(false);

    const initialForm = {
        id: null,
        fullName: '',
        email: '',
        password: '',
        roleId: ''
    };
    const getRoleClass = (roleName) => {
        switch (roleName) {
            case 'Admin': return 'admin';
            case 'Cashier': return 'cashier';
            case 'Barista': return 'barista';
            default: return 'user';
        }
    };
    const [formData, setFormData] = useState(initialForm);
    const editUser = (u) => {
        setFormData({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            roleId: u.roleId
        });
        setShowModal(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = formData.id ? 'PUT' : 'POST';
            const url = formData.id
                ? `${API_BASE_URL}/Users/${formData.id}`
                : `${API_BASE_URL}/Users`;

            const payload = formData.id
                ? {
                    id: formData.id,
                    fullName: formData.fullName,
                    roleId: formData.roleId
                }
                : {
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    roleId: formData.roleId
                };

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            setShowModal(false);
            setFormData(initialForm);
            fetchUsers();
            if (!formData.fullName || !formData.roleId) {
                alert("Vui long nhap ho ten va vai tro");
                return;
            }

            if (!formData.id && (!formData.email || !formData.password)) {
                alert("Email va mat khau la bat buoc");
                return;
            }
        } catch (err) {
            alert("Loi khi luu tai khoan");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const deleteUser = async (id) => {
        if (window.confirm('Ban co chac muon xoa tai khoan nay?')) {
            await fetch(`${API_BASE_URL}/Users/${id}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (

        <section className="view-section active">
            <div className="page-header flex-between">
                <div>
                    <h1>Tai khoan</h1>
                    <p>Quan ly khach hang va nhan su</p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setFormData(initialForm);
                        setShowModal(true);
                    }}
                >
                    <i className="fa-solid fa-plus"></i> Them tai khoan
                </button>
            </div>

            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ho ten</th>
                            <th>Email</th>
                            <th>Vai tro</th>
                            <th>Thao tac</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center"><div className="loader"></div></td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">Khong co tai khoan nao.</td></tr>
                        ) : (
                            users.map(u => (
                                <tr key={u.id}>
                                    <td>#{u.id}</td>
                                    <td><strong>{u.fullName}</strong></td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`role-badge ${getRoleClass(u.roleName)}`}>
                                            <i className={`fa-solid ${u.roleName === 'Admin' ? 'fa-shield' :
                                                u.roleName === 'Cashier' ? 'fa-cash-register' :
                                                    'fa-mug-hot'
                                                }`}></i>
                                            {u.roleName}
                                        </span>
                                    </td>
                                    <td className="action-btns">
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => editUser(u)}
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteUser(u.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
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
                            <h2>{formData.id ? 'Sua tai khoan' : 'Them tai khoan'}</h2>
                            <button className="icon-btn" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Ho ten</label>
                                <input
                                    className="form-control"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    className="form-control"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    disabled={formData.id} // chỉ disable khi edit
                                />
                            </div>
                            {!formData.id && (
                                <div className="form-group">
                                    <label>Mat khau</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Vai tro</label>
                                <select
                                    className="form-control"
                                    value={formData.roleId}
                                    onChange={e => setFormData({
                                        ...formData,
                                        roleId: parseInt(e.target.value)
                                    })}
                                >
                                    <option value="">-- Chon vai tro --</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Huy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Luu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>

    );

}
