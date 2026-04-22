const ORDER_QUEUE_KEY = 'coffeechill_order_queue_v1';
const ORDER_EVENT_NAME = 'coffeechill-orders-updated';

export function getOrderQueue() {
    try {
        const raw = localStorage.getItem(ORDER_QUEUE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveOrderQueue(queue) {
    localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent(ORDER_EVENT_NAME));
}

export function createNextOrderCode() {
    const queue = getOrderQueue();
    const numericCodes = queue
        .map((x) => Number(String(x.code || '').replace(/\D/g, '')))
        .filter((x) => Number.isFinite(x) && x > 0);
    const next = (numericCodes.length ? Math.max(...numericCodes) : 27) + 1;
    return `A${String(next).padStart(3, '0')}`;
}

export function pushOrder(order) {
    const queue = getOrderQueue();
    queue.unshift(order);
    saveOrderQueue(queue.slice(0, 100));
}

export function updateOrderStatus(orderId, nextStatus) {
    const queue = getOrderQueue().map((x) => (
        x.id === orderId ? { ...x, status: nextStatus } : x
    ));
    saveOrderQueue(queue);
}

export function subscribeOrderUpdates(callback) {
    const handler = () => callback(getOrderQueue());
    const onStorage = (event) => {
        if (event.key === ORDER_QUEUE_KEY) handler();
    };
    window.addEventListener(ORDER_EVENT_NAME, handler);
    window.addEventListener('storage', onStorage);
    return () => {
        window.removeEventListener(ORDER_EVENT_NAME, handler);
        window.removeEventListener('storage', onStorage);
    };
}
