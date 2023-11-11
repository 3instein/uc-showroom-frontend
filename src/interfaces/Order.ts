import { Car } from "./Car"
import { Customer } from "./Customer"
import { Motorcycle } from "./Motorcycle"
import { Truck } from "./Truck"

/**
 * Represents an order for a vehicle.
 *
 * @interface Order
 */
export interface Order {
    /**
     * The unique identifier for the order.
     * @type {number}
     */
    id: number;

    /**
     * The customer associated with the order.
     * @type {Customer}
     */
    customer: Customer;

    /**
     * The details of the car associated with the order (optional).
     * @type {Car | undefined}
     */
    car?: Car;

    /**
     * The details of the truck associated with the order (optional).
     * @type {Truck | undefined}
     */
    truck?: Truck;

    /**
     * The details of the motorcycle associated with the order (optional).
     * @type {Motorcycle | undefined}
     */
    motorcycle?: Motorcycle;

    /**
     * The type of vehicle in the order ('car', 'truck', or 'motorcycle').
     * @type {'car' | 'truck' | 'motorcycle'}
     */
    vehicle_type: 'car' | 'truck' | 'motorcycle';

    /**
     * The total price of the vehicle in the order.
     * @type {number}
     */
    vehicle_price: number;
}
