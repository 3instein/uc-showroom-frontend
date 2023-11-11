import axios, { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:3000/orders";

/**
 * Creates a new order with the provided information.
 *
 * @param {number} customer_id - The ID of the customer associated with the order.
 * @param {'car' | 'truck' | 'motorcycle'} vehicle_type - The type of vehicle in the order.
 * @param {number} vehicle_id - The ID of the vehicle in the order.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully creating the order.
 * @throws {Error} - Throws an error if the creation process fails.
 */
export const createOrder = async (
    customer_id: number,
    vehicle_type: 'car' | 'truck' | 'motorcycle',
    vehicle_id: number
): Promise<AxiosResponse> => {
    try {
        const response = await axios.post(`${BASE_URL}`, {
            customer_id,
            vehicle_type,
            vehicle_id
        });
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to create order`);
    }
};

/**
 * Updates an existing order with the provided information.
 *
 * @param {number} id - The ID of the order to be updated.
 * @param {number} customer_id - The updated ID of the customer associated with the order.
 * @param {'car' | 'truck' | 'motorcycle'} previous_vehicle_type - The previous type of vehicle in the order.
 * @param {'car' | 'truck' | 'motorcycle'} vehicle_type - The updated type of vehicle in the order.
 * @param {number} vehicle_id - The updated ID of the vehicle in the order.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully updating the order.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateOrder = async (
    id: number,
    customer_id: number,
    previous_vehicle_type: 'car' | 'truck' | 'motorcycle',
    vehicle_type: 'car' | 'truck' | 'motorcycle',
    vehicle_id: number
): Promise<AxiosResponse> => {
    if (previous_vehicle_type !== vehicle_type) {
        try {
            const deleteResponse = await deleteOrder(id, previous_vehicle_type);
            if (deleteResponse.status === 200) {
                const createResponse = await createOrder(customer_id, vehicle_type, vehicle_id);
                return createResponse;
            }
        } catch (error) {
            // Handle and rethrow the error for better error handling in the application.
            throw new Error(`Failed to update order`);
        }
    }
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, {
            customer_id,
            vehicle_type,
            vehicle_id
        });
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to update order`);
    }
}

/**
 * Deletes an order with the specified ID and vehicle type.
 *
 * @param {number} id - The ID of the order to be deleted.
 * @param {'car' | 'truck' | 'motorcycle'} vehicle_type - The type of vehicle in the order to be deleted.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully deleting the order.
 * @throws {Error} - Throws an error if the deletion process fails.
 */
export const deleteOrder = async (
    id: number,
    vehicle_type: 'car' | 'truck' | 'motorcycle'
): Promise<AxiosResponse> => {
    try {
        switch (vehicle_type) {
            case 'car':
                return await axios.delete(`${BASE_URL}/cars/${id}`);
            case 'truck':
                return await axios.delete(`${BASE_URL}/trucks/${id}`);
            case 'motorcycle':
                return await axios.delete(`${BASE_URL}/motorcycles/${id}`);
            default:
                throw new Error(`Invalid vehicle type: ${vehicle_type}`);
        }
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to delete order`);
    }
};
