import axios from "axios";
import { CreateCustomer, Customer } from "../interfaces/Customer";

const BASE_URL = "http://localhost:3000";

export const createCustomer = async (customer: CreateCustomer) => {
    return await axios.post(`${BASE_URL}/customers`, customer);
}

export const updateCustomer = async (customer: Customer) => {
    return await axios.put(`${BASE_URL}/customers/${customer.id}`, customer);
}