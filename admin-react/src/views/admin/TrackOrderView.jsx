import React, { useState } from 'react';

const DEMO_STATUS = [
    { key: 'received', label: 'Da nhan don', done: true },
    { key: 'making', label: 'Barista dang pha che', done: true },
    { key: 'ready', label: 'San sang nhan mon', done: false }
];

export default function TrackOrderView() {
    const [orderCode, setOrderCode] = useState('A028');

    return (
        <section className="glass-panel">
            <div className="page-header">
                <h1>Theo doi don hang</h1>
                <p>Nhap ma don de kiem tra trang thai realtime.</p>
            </div>

            <div className="form-group">
                <label>Ma don hang</label>
                <div className="track-input-row">
                    <input
                        className="form-control"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                        placeholder="VD: A028"
                    />
                    <button className="btn btn-primary">Kiem tra</button>
                </div>
            </div>

            <div className="track-steps">
                {DEMO_STATUS.map((step) => (
                    <div key={step.key} className={`track-step ${step.done ? 'done' : ''}`}>
                        <i className={`fa-solid ${step.done ? 'fa-circle-check' : 'fa-hourglass-half'}`}></i>
                        <span>{step.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
