import axios, { AxiosResponse } from "axios";
import { Motorcycle, CreateMotorcycle } from "../interfaces/Motorcycle";

const BASE_URL = "http://localhost:3000";

/**
 * Creates a new motorcycle with the provided information.
 *
 * @param {CreateMotorcycle} motorcycle - The motorcycle data for creating a new motorcycle.
 * @returns {Promise<AxiosResponse<Motorcycle>>} - A Promise that resolves to the AxiosResponse containing the created motorcycle.
 * @throws {Error} - Throws an error if the creation process fails.
 */
export const createMotorcycle = async (motorcycle: CreateMotorcycle): Promise<AxiosResponse<Motorcycle>> => {
    try {
        const response = await axios.post(`${BASE_URL}/motorcycles`, motorcycle);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to create motorcycle`);
    }
};

/**
 * Updates an existing motorcycle with the provided information.
 *
 * @param {Motorcycle} motorcycle - The updated motorcycle data.
 * @returns {Promise<AxiosResponse<Motorcycle>>} - A Promise that resolves to the AxiosResponse containing the updated motorcycle.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateMotorcycle = async (motorcycle: Motorcycle): Promise<AxiosResponse<Motorcycle>> => {
    try {
        const response = await axios.put(`${BASE_URL}/motorcycles/${motorcycle.id}`, motorcycle);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to update motorcycle`);
    }
};

/**
 * Deletes a motorcycle with the specified ID.
 *
 * @param {number} id - The ID of the motorcycle to be deleted.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully deleting the motorcycle.
 * @throws {Error} - Throws an error if the deletion process fails.
 */
export const deleteMotorcycle = async (id: number): Promise<AxiosResponse> => {
    try {
        const response = await axios.delete(`${BASE_URL}/motorcycles/${id}`);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to delete motorcycle`);
    }
};
