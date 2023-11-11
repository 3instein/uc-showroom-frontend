import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const insertCustomerResource = async (file: string | File) => {
    const formData = new FormData()

    formData.append('file', file)

    return axios.post(`${BASE_URL}/customers/resource`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}