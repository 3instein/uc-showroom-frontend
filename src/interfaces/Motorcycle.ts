import { Vehicle } from "./Vehicle";

export interface Motorcycle extends Vehicle {
    trunk_capacity: number
    fuel_capacity: number
}

export type CreateMotorcycle = Omit<Motorcycle, "id">;