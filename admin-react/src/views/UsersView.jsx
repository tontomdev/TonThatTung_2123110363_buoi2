import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function UsersView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await fetch(`${API_BASE_URL}/Users/${id}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (
        <section className="view-section active">
            <div className="page-header">
                <h1>Users</h1>
                <p>Manage customers and admins</p>
            </div>
            
            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center"><div className="loader"></div></td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">No users found.</td></tr>
                        ) : (
                            users.map(u => (
                                <tr key={u.id}>
                                    <td>#{u.id}</td>
                                    <td><strong>{u.fullName}</strong></td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className="badge" style={{
                                            position: 'static', 
                                            padding: '3px 8px', 
                                            borderRadius: '12px', 
                                            background: u.role === 'Admin' ? 'var(--accent)' : 'var(--success)',
                                            width: 'auto',
                                            height: 'auto'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="action-btns">
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
