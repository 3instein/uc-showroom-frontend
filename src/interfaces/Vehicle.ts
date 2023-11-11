/**
 * Represents a generic vehicle with basic details.
 *
 * @interface Vehicle
 */
export interface Vehicle {
    /**
     * The unique identifier for the vehicle.
     * @type {number}
     */
    id: number;

    /**
     * The model name of the vehicle.
     * @type {string}
     */
    model: string;

    /**
     * The manufacturing year of the vehicle.
     * @type {number}
     */
    year: number;

    /**
     * The number of seats in the vehicle.
     * @type {number}
     */
    seats: number;

    /**
     * The manufacturer or brand of the vehicle.
     * @type {string}
     */
    manufacturer: string;

    /**
     * The price of the vehicle.
     * @type {number}
     */
    price: number;
}
