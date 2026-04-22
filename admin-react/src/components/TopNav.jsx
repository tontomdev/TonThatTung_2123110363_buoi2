import React from 'react';

export default function TopNav() {
    return (
        <header className="top-nav">
            <div className="search-bar">
                <i className="fa-solid fa-search"></i>
                <input type="text" placeholder="Tim kiem..." />
            </div>
            <div className="nav-actions">
                <button className="icon-btn">
                    <i className="fa-regular fa-bell"></i>
                    <span className="badge">3</span>
                </button>
                <button className="icon-btn">
                    <i className="fa-solid fa-gear"></i>
                </button>
            </div>
        </header>
    );
}
