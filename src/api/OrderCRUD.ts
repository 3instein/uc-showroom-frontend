import axios from "axios";

const BASE_URL = "http://localhost:3000/orders";

// export const createCustomer = async (customer: CreateCustomer) => {
//     return await axios.post(`${BASE_URL}/orders`, customer);
// }

// export const updateCustomer = async (customer: Customer) => {
//     return await axios.put(`${BASE_URL}/orders/${customer.id}`, customer);
// }

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