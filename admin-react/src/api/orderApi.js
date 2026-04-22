import { API_BASE_URL } from "../config";

export const createOrder = async (order) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    return res.json();
};