import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { VehicleForm } from '../Form/VehicleForm';
import { CreateTruck as CreateTruckType, Truck } from '../../interfaces/Truck';
import { createTruck } from '../../api/TruckCRUD';

const CreateTruck: FC = () => {

    const { tableData, setTableData } = useDataTableStore()

    const modal = document.getElementById('create-truck-modal');

    const formik = useFormik({
        initialValues: {
            model: '',
            year: '',
            seats: '',
            manufacturer: '',
            price: '',
            wheels: '',
            cargo_capacity: '',
        },
        validationSchema: Yup.object({
            model: Yup.string().required('Model truk harus diisi'),
            year: Yup.number().required('Tahun truk harus diisi'),
            seats: Yup.number().required('Jumlah kursi harus diisi'),
            manufacturer: Yup.string().required('Merk truk harus diisi'),
            price: Yup.string()
                .required('Harga truk harus diisi')
                .test('is-numeric', 'Invalid format', value => {
                    return value ? !isNaN(Number(value.replace(/\./g, ''))) : true;
                }),
            wheels: Yup.string().required('Jumlah roda truk harus diisi'),
            cargo_capacity: Yup.number().required('Luas area kargo truk harus diisi'),
        }),
        onSubmit: async (values) => {
            const truck: CreateTruckType = {
                model: values.model,
                year: Number(values.year),
                seats: Number(values.seats),
                manufacturer: values.manufacturer,
                price: Number(values.price.replace(/\./g, '')),
                wheels: Number(values.wheels),
                cargo_capacity: Number(values.cargo_capacity),
            }
            try {
                const response = await createTruck(truck);
                if (response.status === 200) {
                    setTableData([...tableData, response.data.data as Truck])
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Truck berhasil ditambahkan',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: modal
                    }).then(() => {
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Truck gagal ditambahkan',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        target: modal
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <>
            {/* Open Modal Button */}
            <button
                className="btn btn-md w-36 btn-ghost bg-blue-500 text-white py-2 px-4 hover:bg-blue-600"
                type="button"
                onClick={() => {
                    if (modal instanceof HTMLDialogElement) {
                        modal.showModal()
                    }
                }}
            >
                <FaPlus className="me-2" />
                Tambah
            </button>
            <dialog id="create-truck-modal" className="modal">
                <div className="modal-box text-left">
                    <form method="dialog">
                        {/* Modal Close Button */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Form Tambah Mobil</h3>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <VehicleForm formik={formik} type='Truck' />
                        {/* Wheels */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Jumlah Roda</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Jumlah Roda"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.wheels && formik.errors.wheels ? 'input-error' : ''}`}
                                {...formik.getFieldProps('wheels')}
                                onInput={(event) => {
                                    // Replace non-digits
                                    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            {formik.touched.wheels && formik.errors.wheels && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.wheels}</span>
                                </label>
                            )}
                        </div>
                        {/* Cargo Capacity */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Luas Area Kargo</span>
                            </label>
                            <input
                                type="text"
                                placeholder="500"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.cargo_capacity && formik.errors.cargo_capacity ? 'input-error' : ''}`}
                                {...formik.getFieldProps('cargo_capacity')}
                                onInput={(event) => {
                                    // Replace non-digits
                                    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            {formik.touched.cargo_capacity && formik.errors.cargo_capacity && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.cargo_capacity}</span>
                                </label>
                            )}
                        </div>
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

export { CreateTruck }