import React, { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { createNextOrderCode, pushOrder } from '../../utils/orderSync';
import { createOrder } from "../../api/orderApi";
function formatVnd(value) {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
}
const API_ORIGIN = new URL(API_BASE_URL).origin;
const resolveImageUrl = (thumbnail) => {
    if (!thumbnail) return '';
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) return thumbnail;
    return `${API_ORIGIN}${thumbnail}`;
};

export default function PosView() {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tat ca');
    const [orderType, setOrderType] = useState('Tai ban');
    const [selectedTable, setSelectedTable] = useState('T05');
    const [paymentMethod, setPaymentMethod] = useState('Tien mat');
    const [orderCode, setOrderCode] = useState(createNextOrderCode());
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [discountValue, setDiscountValue] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await fetch(`${API_BASE_URL}/Products`);
                if (!res.ok) throw new Error('Khong the lay du lieu san pham');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Loi tai san pham POS:', error);
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    const posCategories = useMemo(() => {
        const fromApi = [...new Set(products.map((p) => p.categoryName).filter(Boolean))];
        return ['Tat ca', ...fromApi];
    }, [products]);

    const filteredProducts = useMemo(
        () => products.filter((p) => activeCategory === 'Tat ca' || p.categoryName === activeCategory),
        [products, activeCategory]
    );

    const subtotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.qty * item.price, 0),
        [cartItems]
    );
    const serviceFee = Math.round(subtotal * 0.05);
    const vat = Math.round(subtotal * 0.08);
    const total = subtotal + serviceFee + vat - discountValue;

    const addToCart = (product) => {
        setCartItems((prev) => {
            const found = prev.find((item) => item.id === product.id);
            if (found) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { id: product.id, name: product.productName, qty: 1, price: product.price, size: 'M' }];
        });
    };

    const printBill = () => {
        const billText = [
            'THE COFFEE CHILL',
            '----------------------',
            `Loai don: ${orderType}`,
            `Ban: ${orderType === 'Tai ban' ? selectedTable : 'Mang di'}`,
            ...cartItems.map((x) => `${x.name} x${x.qty} - ${formatVnd(x.qty * x.price)}`),
            `Giam gia: -${formatVnd(discountValue)}`,
            '----------------------',
            `Tong cong: ${formatVnd(total)}`,
            `Thanh toan: ${paymentMethod}`,
            'Cam on quy khach!'
        ].join('\n');
        const popup = window.open('', '_blank', 'width=360,height=600');
        if (!popup) return;
        popup.document.write(`<pre style="font-family:Consolas;padding:16px">${billText}</pre>`);
        popup.document.close();
        popup.focus();
        popup.print();
    };

    const updateQty = (id, delta) => {
        setCartItems((prev) =>
            prev
                .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
                .filter((item) => item.qty > 0)
        );
    };
    const coupons = {
        SALE10: 0.1,   // 10%
        SALE20: 0.2,   // 20%
        FREESHIP: 5000 // giảm 5k
    };
    const applyCoupon = () => {
        const code = discountCode.trim().toUpperCase();

        if (!code) {
            alert("Vui lòng nhập mã giảm giá");
            return;
        }

        const coupon = coupons[code];

        if (!coupon) {
            alert("Mã không hợp lệ");
            return;
        }

        let discount = 0;

        if (coupon < 1) {
            discount = subtotal * coupon; // %
        } else {
            discount = coupon; // tiền cố định
        }

        setDiscountValue(discount);
    };
    useEffect(() => {
        setDiscountValue(0);
    }, [cartItems]);
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Giỏ hàng đang trống');
            return;
        }

        try {
            const orderRequest = {
                userId: 3, // POS tạm thời (sau này lấy từ login)
                orderDetails: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.qty,
                    price: item.price
                })),
                payment: {
                    method: paymentMethod,
                    amount: total
                }
            };

            const result = await createOrder(orderRequest);

            alert(`Thanh toán thành công - Order #${result.id}`);

            // reset POS
            setCartItems([]);
            setOrderCode(createNextOrderCode());

        } catch (error) {
            console.error(error);
            alert("Thanh toán thất bại: " + error.message);
        }
    };

    return (
        <section className="view-section active">
            <div className="page-header pos-header">
                <div>
                    <h1>Quay thu ngan POS</h1>
                    <p>Len mon tai ban va mang di theo phong cach quan ca phe.</p>
                </div>
                <div className="pos-shift-chip">
                    <i className="fa-regular fa-clock"></i> Ca lam 08:00 - 17:00
                </div>
            </div>

            <div className="pos-layout">
                <div className="pos-left-panel glass-panel">
                    <div className="pos-category-tabs">
                        {posCategories.map((category) => (
                            <button
                                key={category}
                                className={`pos-tab ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="pos-products-grid">
                        {loadingProducts && <p className="text-muted">Dang tai san pham...</p>}
                        {!loadingProducts && filteredProducts.length === 0 && <p className="text-muted">Khong co san pham.</p>}
                        {!loadingProducts && filteredProducts.map((product) => (
                            <button key={product.id} className="pos-product-card" onClick={() => addToCart(product)}>
                                <span className="pos-product-badge">{product.quantity > 0 ? 'Con hang' : 'Het hang'}</span>
                                <div className="pos-product-image">
                                    {product.thumbnail ? (
                                        <img src={resolveImageUrl(product.thumbnail)} alt={product.productName} className="pos-product-photo" />
                                    ) : (
                                        '☕'
                                    )}
                                </div>
                                <h3>{product.productName}</h3>
                                <p>{formatVnd(Number(product.price) || 0)}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pos-right-panel glass-panel">
                    <div className="pos-order-head">
                        <h3>Don hang #{orderCode}</h3>
                        <span>{orderType === 'Tai ban' ? `Tai ban - ${selectedTable}` : 'Mang di'}</span>
                    </div>

                    <div className="pos-control-grid">
                        <div className="form-group">
                            <label>Loai don</label>
                            <select className="form-control" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                                <option value="Tai ban">Tai ban</option>
                                <option value="Mang di">Mang di</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ban / Hang doi</label>
                            <select
                                className="form-control"
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                disabled={orderType !== 'Tai ban'}
                            >
                                <option value="T01">Ban 01</option>
                                <option value="T02">Ban 02</option>
                                <option value="T03">Ban 03</option>
                                <option value="T04">Ban 04</option>
                                <option value="T05">Ban 05</option>
                            </select>
                        </div>
                    </div>

                    <div className="pos-cart-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="pos-cart-item">
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>Size {item.size} - {formatVnd(item.price)}</p>
                                </div>
                                <div className="pos-qty">
                                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pos-summary">
                        {discountValue > 0 && (
                            <div>
                                <span>Giam gia</span>
                                <strong>-{formatVnd(discountValue)}</strong>
                            </div>
                        )}
                        <div><span>Tam tinh</span><strong>{formatVnd(subtotal)}</strong></div>
                        <div><span>Phi dich vu (5%)</span><strong>{formatVnd(serviceFee)}</strong></div>
                        <div><span>VAT (8%)</span><strong>{formatVnd(vat)}</strong></div>
                        <div className="pos-total"><span>Tong cong</span><strong>{formatVnd(total)}</strong></div>
                    </div>

                    <div className="pos-payment-actions">
                        <input
                            type="text"
                            placeholder="Nhap ma giam gia"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="form-control"
                        />

                        <button className="btn btn-secondary" onClick={applyCoupon}>
                            Ap dung
                        </button>
                        <button className="btn btn-primary" onClick={handleCheckout}><i className="fa-solid fa-credit-card"></i> Thanh toan</button>
                        <div className="pos-coupon-box">

                        </div>
                    </div>

                    <div className="pos-control-grid" style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label>Phuong thuc thanh toan</label>
                            <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="Tien mat">Tien mat</option>
                                <option value="The">The</option>
                                <option value="Vi dien tu">Vi dien tu</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Hoa don</label>
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={printBill}>
                                <i className="fa-solid fa-print"></i> In hoa don
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
