import axios, { AxiosResponse } from "axios";
import { CreateTruck, Truck } from "../interfaces/Truck";

const BASE_URL = "http://localhost:3000";

/**
 * Creates a new truck with the provided information.
 *
 * @param {CreateTruck} truck - The truck information to be created.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully creating the truck.
 * @throws {Error} - Throws an error if the creation process fails.
 */
export const createTruck = async (truck: CreateTruck): Promise<AxiosResponse> => {
    try {
        const response = await axios.post(`${BASE_URL}/trucks`, truck);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to create truck`);
    }
};

/**
 * Updates an existing truck with the provided information.
 *
 * @param {Truck} truck - The updated truck information.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully updating the truck.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateTruck = async (truck: Truck): Promise<AxiosResponse> => {
    try {
        const response = await axios.put(`${BASE_URL}/trucks/${truck.id}`, truck);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to update truck`);
    }
};

/**
 * Deletes a truck with the specified ID.
 *
 * @param {number} id - The ID of the truck to be deleted.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully deleting the truck.
 * @throws {Error} - Throws an error if the deletion process fails.
 */
export const deleteTruck = async (id: number): Promise<AxiosResponse> => {
    try {
        const response = await axios.delete(`${BASE_URL}/trucks/${id}`);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to delete truck`);
    }
};
