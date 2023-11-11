import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC, useEffect, useId, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Customer } from '../../interfaces/Customer';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { SelectOption } from '../../interfaces/SelectOption';
import { Car } from '../../interfaces/Car';
import { Truck } from '../../interfaces/Truck';
import { Motorcycle } from '../../interfaces/Motorcycle';
import { createOrder } from '../../api/OrderCRUD';
import { Order } from '../../interfaces/Order';

const CreateOrder: FC = () => {

    const vehicle_types: SelectOption<string>[] = [
        { value: 'car', label: 'Mobil' },
        { value: 'truck', label: 'Truk' },
        { value: 'motorcycle', label: 'Motor' },
    ]

    const BASE_URL = 'http://localhost:3000/'

    const { tableData, setTableData } = useDataTableStore()

    const [customers, setCustomers] = useState<SelectOption<Customer>[]>([])
    const [cars, setCars] = useState<SelectOption<Car>[]>([])
    const [trucks, setTrucks] = useState<SelectOption<Truck>[]>([])
    const [motorcycles, setMotorcycles] = useState<SelectOption<Motorcycle>[]>([])

    const formik = useFormik({
        initialValues: {
            customer: null,
            vehicle_type: '',
            car: null,
            truck: null,
            motorcycle: null,
        },
        validationSchema: Yup.object({
            customer: Yup.number().required('Customer harus diisi'),
            vehicle_type: Yup.string().required('Tipe kendaraan harus diisi'),
        }),
        onSubmit: async (values) => {
            const vehicle_id = values.vehicle_type === 'car' ? values.car : values.vehicle_type === 'truck' ? values.truck : values.motorcycle
            const vehicle_type = values.vehicle_type === 'car' ? 'car' : values.vehicle_type === 'truck' ? 'truck' : 'motorcycle'
            try {
                const response = await createOrder(values.customer!, vehicle_type, vehicle_id!)
                if (response.status === 200) {
                    mutate(BASE_URL + 'orders')
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Order berhasil ditambahkan',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: document.getElementById('create-order-modal') as HTMLElement
                    }).then(() => {
                        const modal = document.getElementById('create-order-modal');
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Order gagal ditambahkan',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        target: document.getElementById('create-order-modal') as HTMLElement
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    })

    const fetcher = (url: string) => axios.get(url).then(res => res.data)

    const { data: customersData = [], error: errorCustomers, isLoading: isLoadingCustomers } = useSWR(BASE_URL + 'customers', fetcher)
    const { data: carsData = [], error: errorCars, isLoading: isLoadingCars } = useSWR(BASE_URL + 'cars', fetcher)
    const { data: trucksData = [], error: errorTrucks, isLoading: isLoadingTrucks } = useSWR(BASE_URL + 'trucks', fetcher)
    const { data: motorcyclesData = [], error: errorMotorcycles, isLoading: isLoadingMotorcycles } = useSWR(BASE_URL + 'motorcycles', fetcher)

    useEffect(() => {
        if (!isLoadingCustomers) {
            const customers: SelectOption<Customer>[] = customersData.data.map((customer: Customer) => {
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
            const cars: SelectOption<Car>[] = carsData.data.map((car: Car) => {
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
            const trucks: SelectOption<Truck>[] = trucksData.data.map((truck: Truck) => {
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
            const motorcycles: SelectOption<Motorcycle>[] = motorcyclesData.data.map((motorcycle: Motorcycle) => {
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
            {/* Open Modal Button */}
            <button
                className="btn btn-md w-36 btn-ghost bg-blue-500 text-white py-2 px-4 hover:bg-blue-600"
                type="button"
                onClick={() => {
                    const modal = document.getElementById('create-order-modal');
                    if (modal instanceof HTMLDialogElement) {
                        modal.showModal()
                    }
                }}
            >
                <FaPlus className="me-2" />
                Tambah
            </button>
            <dialog id="create-order-modal" className="modal">
                <div className="modal-box h-1/2 text-left">
                    <form method="dialog">
                        {/* Modal Close Button */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Form Tambah Order</h3>
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
                                value={customers?.find(option => option.value.id === formik.values.customer)}
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
                                    () => formik.values.vehicle_type === '' && formik.setFieldTouched("vehicle_type", true)
                                }
                                isSearchable={true}
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
                                        value={cars?.find(option => option.value.id === formik.values.car)}
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
                                            value={trucks?.find(option => option.value.id === formik.values.truck)}
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
                                            value={motorcycles?.find(option => option.value.id === formik.values.motorcycle)}
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
                                        />
                                        {formik.touched.motorcycle && formik.errors.motorcycle && (
                                            <label className="label pt-1">
                                                <span className="label-text text-xs text-red-600">{formik.errors.motorcycle}</span>
                                            </label>
                                        )}
                                    </div>
                        }
                        <button type='submit' className='btn btn-primary float-right'>Tambah</button>
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

export { CreateOrder }