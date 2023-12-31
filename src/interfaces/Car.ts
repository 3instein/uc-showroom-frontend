import { Vehicle } from "./Vehicle";
/**
 * Represents a car, extending the basic details of a vehicle.
 *
 * @interface Car
 * @extends {Vehicle}
 */
export interface Car extends Vehicle {
    /**
     * The type of fuel the car uses.
     * @type {string}
     */
    fuel_type: string;

    /**
     * The capacity of the car's trunk in liters.
     * @type {number}
     */
    trunk_capacity: number;
}

/**
 * Represents the response data for a car, including the basic details and additional information.
 *
 * @interface CarResponse
 * @extends {Car}
 */
export interface CarResponse extends Car {
    /**
     * The complete data of the car.
     * @type {Car}
     */
    data: Car;
}

/**
 * Represents the data required to create a new car, excluding the unique identifier.
 *
 * @type CreateCar
 * @extends Omit<Car, "id">
 */
export type CreateCar = Omit<Car, "id">;
