import { Car } from "./Car"
import { Customer } from "./Customer"
import { Motorcycle } from "./Motorcycle"
import { Truck } from "./Truck"

export interface Order {
    id: number
    customer: Customer
    car? : Car
    truck? : Truck
    motorcycle? : Motorcycle
    vehicle_type: 'car' | 'truck' | 'motorcycle'
    vehicle_price: number
}