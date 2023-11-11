export interface Customer {
    id: string
    name: string
    address: string
    phone: string
    id_card_number: string
}

export type CreateCustomer = Omit<Customer, "id">;