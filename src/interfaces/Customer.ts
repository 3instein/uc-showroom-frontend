/**
 * Represents a customer with personal details.
 *
 * @interface Customer
 */
export interface Customer {
    /**
     * The unique identifier for the customer.
     * @type {number}
     */
    id: number;

    /**
     * The name of the customer.
     * @type {string}
     */
    name: string;

    /**
     * The address of the customer.
     * @type {string}
     */
    address: string;

    /**
     * The phone number of the customer.
     * @type {string}
     */
    phone: string;

    /**
     * The ID card number of the customer.
     * @type {string}
     */
    id_card_number: string;

    /**
     * The URL or path to the ID card photo of the customer.
     * @type {string}
     */
    id_card_photo: string;
}

/**
 * Represents the data required to create a new customer, excluding the unique identifier.
 *
 * @type CreateCustomer
 * @extends Omit<Customer, 'id'>
 */
export type CreateCustomer = Omit<Customer, 'id'>;
