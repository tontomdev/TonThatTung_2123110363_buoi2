import React, { useState } from 'react';

const INITIAL_STAFF = [
    { id: 1, name: 'Nguyen Minh Anh', role: 'Quan ly', shift: '06:00 - 15:00', status: 'Dang lam' },
    { id: 2, name: 'Tran Bao Nhi', role: 'Thu ngan', shift: '08:00 - 17:00', status: 'Dang lam' },
    { id: 3, name: 'Le Hoang Quan', role: 'Barista', shift: '09:00 - 18:00', status: 'Nghi giai lao' },
    { id: 4, name: 'Pham Khanh Ly', role: 'Barista', shift: '12:00 - 21:00', status: 'Het ca' }
];

export default function StaffView() {
    const [staff] = useState(INITIAL_STAFF);

    return (
        <section className="view-section active">
            <div className="page-header flex-between">
                <div>
                    <h1>Quan ly nhan vien</h1>
                    <p>Quan ly vai tro, lich lam va trang thai ca lam.</p>
                </div>
                <button className="btn btn-primary">
                    <i className="fa-solid fa-user-plus"></i> Them nhan vien
                </button>
            </div>

            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nhan vien</th>
                            <th>Vai tro</th>
                            <th>Ca lam</th>
                            <th>Trang thai</th>
                            <th>Thao tac</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((person) => {
                            const statusClass =
                                person.status === 'Dang lam' ? 'text-success' :
                                    person.status === 'Nghi giai lao' ? 'text-warning' : 'text-muted';
                            return (
                                <tr key={person.id}>
                                    <td>#{person.id}</td>
                                    <td><strong>{person.name}</strong></td>
                                    <td>{person.role}</td>
                                    <td>{person.shift}</td>
                                    <td className={statusClass}><strong>{person.status}</strong></td>
                                    <td className="action-btns">
                                        <button className="btn btn-sm btn-warning"><i className="fa-solid fa-pen"></i></button>
                                        <button className="btn btn-sm btn-secondary"><i className="fa-regular fa-calendar"></i></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
