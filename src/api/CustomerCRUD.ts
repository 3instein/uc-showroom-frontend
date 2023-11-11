import axios from "axios";
import { CreateCustomer } from "../interfaces/Customer";

const BASE_URL = "http://localhost:3000";

export const createCustomer = async (customer: CreateCustomer) => {
    return await axios.post(`${BASE_URL}/customers`, customer);
}