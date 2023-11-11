import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Customer } from '../../interfaces/Customer';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { SelectOption } from '../../interfaces/SelectOption';
import { Car } from '../../interfaces/Car';
import { Truck } from '../../interfaces/Truck';
import { Motorcycle } from '../../interfaces/Motorcycle';
import { updateOrder } from '../../api/OrderCRUD';
import { Order } from '../../interfaces/Order';

/**
 * Interface for the props of the UpdateOrder component.
 */
interface UpdateOrderProps {
    order: Order;
}

/**
 * Functional component for updating an existing order.
 *
 * @component
 * @param {UpdateOrderProps} props - The properties of the component.
 * @returns {JSX.Element}
 */

const UpdateOrder: FC<UpdateOrderProps> = ({ order }) => {
    // Options for the vehicle type select
    const vehicle_types: SelectOption[] = [
        { value: 'car', label: 'Mobil' },
        { value: 'truck', label: 'Truk' },
        { value: 'motorcycle', label: 'Motor' },
    ]

    // Reference to the dialog element
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Base URL for the API
    const BASE_URL = 'http://localhost:3000/'

    // State variables for customer, vehicle, and type options
    const [customers, setCustomers] = useState<SelectOption[]>([])
    const [cars, setCars] = useState<SelectOption[]>([])
    const [trucks, setTrucks] = useState<SelectOption[]>([])
    const [motorcycles, setMotorcycles] = useState<SelectOption[]>([])

    // Formik hook for form management and validation
    const formik = useFormik({
        initialValues: {
            customer: order.customer.id,
            vehicle_type: order.vehicle_type,
            car: order.car ? order.car.id : null,
            truck: order.truck ? order.truck.id : null,
            motorcycle: order.motorcycle ? order.motorcycle.id : null,
        },
        validationSchema: Yup.object({
            customer: Yup.number().required('Customer harus diisi'),
            vehicle_type: Yup.string().required('Tipe kendaraan harus diisi'),
        }),
        onSubmit: async (values) => {
            // Determine the vehicle ID and type based on the selected vehicle type
            const vehicle_id = values.vehicle_type === 'car' ? values.car :
                values.vehicle_type === 'truck' ? values.truck
                    : values.motorcycle
            const vehicle_type = values.vehicle_type === 'car' ? 'car' :
                values.vehicle_type === 'truck' ? 'truck' :
                    'motorcycle'
            try {
                // Make an API request to update the order
                const response = await updateOrder(order.id, values.customer!, order.vehicle_type, vehicle_type, vehicle_id!)
                // Handle the response
                if (response.status === 200) {
                    // Refresh the orders data
                    mutate(BASE_URL + 'orders')
                    // Show a success alert
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Order berhasil diupdate',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: document.getElementById(`update-order-modal-${order.id}`) as HTMLElement
                    }).then(() => {
                        // Close the modal
                        const modal = document.getElementById(`update-order-modal-${order.id}`);
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    // Show an error alert
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Order gagal diupdate',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        target: document.getElementById(`update-order-modal-${order.id}`) as HTMLElement
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    })

    // SWR hook for fetching data from the API
    const fetcher = (url: string) => axios.get(url).then(res => res.data)

    // SWR hooks for customers, cars, trucks, and motorcycles data
    const { data: customersData = [], error: errorCustomers, isLoading: isLoadingCustomers } = useSWR(BASE_URL + 'customers', fetcher)
    const { data: carsData = [], error: errorCars, isLoading: isLoadingCars } = useSWR(BASE_URL + 'cars', fetcher)
    const { data: trucksData = [], error: errorTrucks, isLoading: isLoadingTrucks } = useSWR(BASE_URL + 'trucks', fetcher)
    const { data: motorcyclesData = [], error: errorMotorcycles, isLoading: isLoadingMotorcycles } = useSWR(BASE_URL + 'motorcycles', fetcher)

    // Populate the options for the customers, cars, trucks, and motorcycles select
    useEffect(() => {
        if (!isLoadingCustomers) {
            const customers = customersData.data.map((customer: Customer) => {
                return {
                    value: customer.id,
                    label: customer.name
                }
            })
            setCustomers(customers)
        }
    }, [customersData])

    useEffect(() => {
        if (!isLoadingCars) {
            const cars = carsData.data.map((car: Car) => {
                return {
                    value: car.id,
                    label: car.model
                }
            })
            setCars(cars)
        }
    }, [carsData])

    useEffect(() => {
        if (!isLoadingTrucks) {
            const trucks = trucksData.data.map((truck: Truck) => {
                return {
                    value: truck.id,
                    label: truck.model
                }
            })
            setTrucks(trucks)
        }
    }, [trucksData])

    useEffect(() => {
        if (!isLoadingMotorcycles) {
            const motorcycles = motorcyclesData.data.map((motorcycle: Motorcycle) => {
                return {
                    value: motorcycle.id,
                    label: motorcycle.model
                }
            })
            setMotorcycles(motorcycles)
        }
    }, [motorcyclesData])

    if (errorCustomers || errorCars || errorTrucks || errorMotorcycles) return <div>error...</div>

    return (
        <>
            <dialog id={`update-order-modal-${order.id}`} className="modal" ref={dialogRef}>
                <div className="modal-box text-left">
                    <form method="dialog">
                        {/* Modal Close Button */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Form Update Order</h3>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        {/* Customer */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Customer</span>
                            </label>
                            <Select
                                isDisabled={false}
                                key={1}
                                options={customers}
                                placeholder="Pilih Customer"
                                value={customers?.find(option => option.value === formik.values.customer)}
                                onChange={
                                    option => {
                                        formik.setFieldValue('customer', option?.value)
                                    }
                                }
                                onBlur={
                                    () => formik.values.customer === Number('') && formik.setFieldTouched("customer", true)
                                }
                                isSearchable={true}
                                isLoading={isLoadingCustomers}
                                menuPortalTarget={dialogRef.current}
                            />
                            {formik.touched.customer && formik.errors.customer && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.customer}</span>
                                </label>
                            )}
                        </div>
                        {/* Vehicle Type */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Tipe Kendaraan</span>
                            </label>
                            <Select
                                isDisabled={false}
                                key={1}
                                options={vehicle_types}
                                placeholder="Pilih Tipe Kendaraan"
                                value={vehicle_types?.find(option => option.value === formik.values.vehicle_type)}
                                onChange={
                                    option => {
                                        formik.setFieldValue('vehicle_type', option?.value)
                                    }
                                }
                                onBlur={
                                    () => formik.values.vehicle_type === null && formik.setFieldTouched("vehicle_type", true)
                                }
                                isSearchable={true}
                                menuPortalTarget={dialogRef.current}
                            />
                            {formik.touched.vehicle_type && formik.errors.vehicle_type && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.vehicle_type}</span>
                                </label>
                            )}
                        </div>
                        {
                            formik.values.vehicle_type === 'car' ?
                                <div className="form-control w-full max-w-xs">
                                    <label className="label">
                                        <span className="label-text font-bold">Mobil</span>
                                    </label>
                                    <Select
                                        isDisabled={false}
                                        key={2}
                                        options={cars}
                                        placeholder="Pilih Mobil"
                                        value={cars?.find(option => option.value === formik.values.car)}
                                        onChange={
                                            option => {
                                                formik.setFieldValue('car', option?.value)
                                            }
                                        }
                                        onBlur={
                                            () => formik.values.car === Number('') && formik.setFieldTouched("car", true)
                                        }
                                        isSearchable={true}
                                        isLoading={isLoadingCars}
                                        menuPortalTarget={dialogRef.current}
                                    />
                                    {formik.touched.car && formik.errors.car && (
                                        <label className="label pt-1">
                                            <span className="label-text text-xs text-red-600">{formik.errors.car}</span>
                                        </label>
                                    )}
                                </div>
                                :
                                formik.values.vehicle_type === 'truck' ?
                                    <div className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text font-bold">Truk</span>
                                        </label>
                                        <Select
                                            isDisabled={false}
                                            key={3}
                                            options={trucks}
                                            placeholder="Pilih Truk"
                                            value={trucks?.find(option => option.value === formik.values.truck)}
                                            onChange={
                                                option => {
                                                    formik.setFieldValue('truck', option?.value)
                                                }
                                            }
                                            onBlur={
                                                () => formik.values.truck === Number('') && formik.setFieldTouched("truck", true)
                                            }
                                            isSearchable={true}
                                            isLoading={isLoadingTrucks}
                                            menuPortalTarget={dialogRef.current}
                                        />
                                        {formik.touched.truck && formik.errors.truck && (
                                            <label className="label pt-1">
                                                <span className="label-text text-xs text-red-600">{formik.errors.truck}</span>
                                            </label>
                                        )}
                                    </div>
                                    :
                                    formik.values.vehicle_type === 'motorcycle' &&
                                    <div className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text font-bold">Motor</span>
                                        </label>
                                        <Select
                                            isDisabled={false}
                                            key={4}
                                            options={motorcycles}
                                            placeholder="Pilih Motor"
                                            value={motorcycles?.find(option => option.value === formik.values.motorcycle)}
                                            onChange={
                                                option => {
                                                    formik.setFieldValue('motorcycle', option?.value)
                                                }
                                            }
                                            onBlur={
                                                () => formik.values.motorcycle === Number('') && formik.setFieldTouched("motorcycle", true)
                                            }
                                            isSearchable={true}
                                            isLoading={isLoadingMotorcycles}
                                            menuPortalTarget={dialogRef.current}
                                        />
                                        {formik.touched.motorcycle && formik.errors.motorcycle && (
                                            <label className="label pt-1">
                                                <span className="label-text text-xs text-red-600">{formik.errors.motorcycle}</span>
                                            </label>
                                        )}
                                    </div>
                        }
                        <button type='submit' className='btn btn-primary float-right'>Update</button>
                    </form>
                </div>
                {/* Modal Backdrop Close */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export { UpdateOrder }