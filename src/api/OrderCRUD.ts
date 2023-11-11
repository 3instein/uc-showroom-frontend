import axios from "axios";

const BASE_URL = "http://localhost:3000/orders";

export const createOrder = async (customer_id: number, vehicle_type: 'car' | 'truck' | 'motorcycle', vehicle_id: number) => {
    return await axios.post(`${BASE_URL}`, {
        customer_id,
        vehicle_type,
        vehicle_id
    });
}

export const updateOrder = async (id: number, customer_id: number, vehicle_type: 'car' | 'truck' | 'motorcycle', vehicle_id: number) => {
    return await axios.put(`${BASE_URL}/${id}`, {
        customer_id,
        vehicle_type,
        vehicle_id
    });
}

export const deleteOrder = async (id: number, vehicle_type: 'car' | 'truck' | 'motorcycle') => {
    switch (vehicle_type) {
        case 'car':
            return await axios.delete(`${BASE_URL}/cars/${id}`);
        case 'truck':
            return await axios.delete(`${BASE_URL}/trucks/${id}`);
        case 'motorcycle':
            return await axios.delete(`${BASE_URL}/motorcycles/${id}`);
    }
}