import axios, { AxiosResponse } from "axios";
import { CreateCustomer, Customer, CustomerResponse } from "../interfaces/Customer";

const BASE_URL = "http://localhost:3000";

/**
 * Creates a new customer with the provided information.
 *
 * @param {CreateCustomer} customer - The customer data for creating a new customer.
 * @returns {Promise<AxiosResponse<CustomerResponse>>} - A Promise that resolves to the AxiosResponse containing the created customer.
 * @throws {Error} - Throws an error if the creation process fails.
 */
export const createCustomer = async (customer: CreateCustomer): Promise<AxiosResponse<CustomerResponse>> => {
    try {
        const response = await axios.post(`${BASE_URL}/customers`, customer);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to create customer`);
    }
};

/**
 * Updates an existing customer with the provided information.
 *
 * @param {Customer} customer - The updated customer data.
 * @returns {Promise<AxiosResponse<CustomerResponse>>} - A Promise that resolves to the AxiosResponse containing the updated customer.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateCustomer = async (customer: Customer): Promise<AxiosResponse<CustomerResponse>> => {
    try {
        const response = await axios.put(`${BASE_URL}/customers/${customer.id}`, customer);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to update customer`);
    }
};

/**
 * Deletes a customer with the specified ID.
 *
 * @param {number} id - The ID of the customer to be deleted.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully deleting the customer.
 * @throws {Error} - Throws an error if the deletion process fails.
 */
export const deleteCustomer = async (id: number): Promise<AxiosResponse> => {
    try {
        const response = await axios.delete(`${BASE_URL}/customers/${id}`);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to delete customer`);
    }
};
