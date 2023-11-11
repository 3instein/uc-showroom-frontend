import axios from "axios";
import { Motorcycle, CreateMotorcycle } from "../interfaces/Motorcycle";

const BASE_URL = "http://localhost:3000";

export const createMotorcycle = async (motorcycle: CreateMotorcycle) => {
    return await axios.post(`${BASE_URL}/motorcycles`, motorcycle);
}

// export const updateCar = async (car: Car) => {
//     return await axios.put(`${BASE_URL}/cars/${car.id}`, car);
// }

export const deleteMotorcycle = async (id: number) => {
    return await axios.delete(`${BASE_URL}/motorcycles/${id}`);
}