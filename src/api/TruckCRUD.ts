import axios from "axios";
import { CreateTruck } from "../interfaces/Truck";

const BASE_URL = "http://localhost:3000";

export const createTruck = async (truck: CreateTruck) => {
    return await axios.post(`${BASE_URL}/trucks`, truck);
}

// export const updateCar = async (car: Car) => {
//     return await axios.put(`${BASE_URL}/cars/${car.id}`, car);
// }

export const deleteTruck = async (id: number) => {
    return await axios.delete(`${BASE_URL}/trucks/${id}`);
}