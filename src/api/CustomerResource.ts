import axios, { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:3000";

/**
 * Inserts a customer resource, such as an ID card photo, into the server.
 *
 * @param {string | File} file - The customer resource file to be uploaded. Can be either a file path or a File object.
 * @returns {Promise<AxiosResponse>} - A Promise that resolves to the AxiosResponse after successfully inserting the customer resource.
 * @throws {Error} - Throws an error if the insertion process fails.
 */
export const insertCustomerResource = async (file: string | File): Promise<AxiosResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${BASE_URL}/customers/resource`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (error) {
        // Handle and rethrow the error for better error handling in the application.
        throw new Error(`Failed to insert customer resource`);
    }
};
