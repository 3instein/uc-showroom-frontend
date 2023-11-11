import axios, { AxiosResponse } from "axios";
import { Car, CreateCar } from "../interfaces/Car";

const BASE_URL = "http://localhost:3000";

/**
 * Creates a new car with the provided information.
 *
 * @param {CreateCar} car - The car data for creating a new car.
 * @returns {Promise<AxiosResponse<Car>>} - A Promise that resolves to the AxiosResponse containing the created car.
 * @throws {Error} - Throws an error if the creation process fails.
 */
export const createCar = async (car: CreateCar): Promise<AxiosResponse<Car>> => {
    try {
        const response = await axios.post(`${BASE_URL}/cars`, car);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to create car`);
    }
};

/**
 * Updates an existing car with the provided information.
 *
 * @param {Car} car - The updated car data.
 * @returns {Promise<AxiosResponse<Car>>} - A Promise that resolves to the AxiosResponse containing the updated car.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateCar = async (car: Car): Promise<AxiosResponse<Car>> => {
    try {
        const response = await axios.put(`${BASE_URL}/cars/${car.id}`, car);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to update car`);
    }
};

/**
 * Deletes a car with the specified ID.
 *
 * @param {number} id - The ID of the car to be deleted.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully deleting the car.
 * @throws {Error} - Throws an error if the deletion process fails.
 */
export const deleteCar = async (id: number): Promise<AxiosResponse> => {
    try {
        const response = await axios.delete(`${BASE_URL}/cars/${id}`);
        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to delete car`);
    }
};
