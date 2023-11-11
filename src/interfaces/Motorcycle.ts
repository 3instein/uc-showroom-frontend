import { Vehicle } from "./Vehicle";

/**
 * Represents a motorcycle, extending the basic details of a vehicle.
 *
 * @interface Motorcycle
 * @extends {Vehicle}
 */
export interface Motorcycle extends Vehicle {
    /**
     * The trunk capacity of the motorcycle in liters.
     * @type {number}
     */
    trunk_capacity: number;

    /**
     * The fuel capacity of the motorcycle in liters.
     * @type {number}
     */
    fuel_capacity: number;
}

/**
 * Represents the response data when retrieving a motorcycle.
 *
 * @interface MotorcycleResponse
 */
export interface MotorcycleResponse {
    /**
     * The data of the retrieved motorcycle.
     * @type {Motorcycle}
     */
    data: Motorcycle;
}


/**
 * Represents the data required to create a new motorcycle, excluding the unique identifier.
 *
 * @type CreateMotorcycle
 * @extends Omit<Motorcycle, "id">
 */
export type CreateMotorcycle = Omit<Motorcycle, "id">;
