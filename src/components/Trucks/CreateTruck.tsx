import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { VehicleForm } from '../Form/VehicleForm';
import { CreateTruck as CreateTruckType, Truck } from '../../interfaces/Truck';
import { createTruck } from '../../api/TruckCRUD';

/**
 * React component for creating a new truck.
 *
 * @component
 * @example
 * // Example usage in a parent component
 * import { CreateTruck } from './CreateTruck';
 * //...
 * <CreateTruck />
 */
const CreateTruck: FC = () => {
    // Access the DataTable store to manage table data
    const { tableData, setTableData } = useDataTableStore()
    // Reference to the modal element
    const modal = document.getElementById('create-truck-modal');

    // Formik hook for form management and validation
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
        // Validation schema for form fields
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
            // Construct new truck object
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
                // Send POST request to API
                const response = await createTruck(truck);
                // If request is successful, update the table data
                if (response.status === 200) {
                    // Add the new truck to the table data
                    setTableData([...tableData, response.data.data as Truck])
                    // Show success alert
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Truk berhasil ditambahkan',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: modal
                    }).then(() => {
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    // Show error alert
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Truk gagal ditambahkan',
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

    // Event listener for modal close
    if (modal) {
        modal.addEventListener('close', () => {
            formik.resetForm()
        })
    }

    // Render the CreateTruck component
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
                    <h3 className="font-bold text-lg">Form Tambah Truk</h3>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <VehicleForm formik={formik} type='Truk' />
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
                                maxLength={2}
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
                                maxLength={5}
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