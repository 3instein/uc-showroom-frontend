import { Vehicle } from "./Vehicle";

export interface Truck extends Vehicle {
    wheels: number
    cargo_capacity: number
}

export type CreateTruck = Omit<Truck, "id">;