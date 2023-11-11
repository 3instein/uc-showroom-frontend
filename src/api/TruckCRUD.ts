import axios from "axios";
import { CreateTruck, Truck } from "../interfaces/Truck";

const BASE_URL = "http://localhost:3000";

export const createTruck = async (truck: CreateTruck) => {
    return await axios.post(`${BASE_URL}/trucks`, truck);
}

export const updateTruck = async (truck: Truck) => {
    return await axios.put(`${BASE_URL}/trucks/${truck.id}`, truck);
}

export const deleteTruck = async (id: number) => {
    return await axios.delete(`${BASE_URL}/trucks/${id}`);
}