import axios from "axios";
import { Car, CreateCar } from "../interfaces/Car";

const BASE_URL = "http://localhost:3000";

export const createCar = async (car: CreateCar) => {
    return await axios.post(`${BASE_URL}/cars`, car);
}

export const updateCar = async (car: Car) => {
    return await axios.put(`${BASE_URL}/cars/${car.id}`, car);
}

export const deleteCar = async (id: number) => {
    return await axios.delete(`${BASE_URL}/cars/${id}`);
}