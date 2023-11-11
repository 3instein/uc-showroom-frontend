import axios from "axios";
import { Car, CreateCar } from "../interfaces/Car";

const BASE_URL = "http://localhost:3000";

export const createCar = async (car: CreateCar) => {
    return await axios.post(`${BASE_URL}/cars`, car);
}