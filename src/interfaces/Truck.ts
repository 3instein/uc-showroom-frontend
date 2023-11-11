import { Vehicle } from "./Vehicle";

/**
 * Represents a truck, extending the basic details of a vehicle.
 *
 * @interface Truck
 * @extends {Vehicle}
 */
export interface Truck extends Vehicle {
    /**
     * The number of wheels on the truck.
     * @type {number}
     */
    wheels: number;

    /**
     * The cargo capacity of the truck in liters.
     * @type {number}
     */
    cargo_capacity: number;
}

/**
 * Represents the response data structure when fetching a single truck.
 *
 * @interface TruckResponse
 */
export interface TruckResponse {
    /**
     * The data of the truck.
     * @type {Truck}
     */
    data: Truck;
}

/**
 * Represents the data required to create a new truck, excluding the unique identifier.
 *
 * @type CreateTruck
 * @extends Omit<Truck, "id">
 */
export type CreateTruck = Omit<Truck, "id">;
