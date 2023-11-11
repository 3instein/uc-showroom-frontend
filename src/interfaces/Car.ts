import { Vehicle } from "./Vehicle";

export interface Car extends Vehicle {
    fuel_type: string
    trunk_capacity: number
}