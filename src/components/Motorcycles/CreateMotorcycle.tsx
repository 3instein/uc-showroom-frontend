import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { VehicleForm } from '../Form/VehicleForm';
import { CreateMotorcycle as CreateMotorcycleType, Motorcycle } from '../../interfaces/Motorcycle';
import { createMotorcycle } from '../../api/MotorcycleCRUD';

/**
 * Functional component for creating a new motorcycle.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateMotorcycle: FC = () => {
    // Access the DataTable store to update the table data
    const { tableData, setTableData } = useDataTableStore()

    // Access the modal element
    const modal = document.getElementById('create-motorcycle-modal');

    // Formik hook for form management and validation
    const formik = useFormik({
        initialValues: {
            model: '',
            year: '',
            seats: '',
            manufacturer: '',
            price: '',
            trunk_capacity: '',
            fuel_capacity: '',
        },
        // Validation schema for form fields
        validationSchema: Yup.object({
            model: Yup.string().required('Model motor harus diisi'),
            year: Yup.number().required('Tahun motor harus diisi'),
            seats: Yup.number().required('Jumlah kursi harus diisi'),
            manufacturer: Yup.string().required('Merk motor harus diisi'),
            price: Yup.string()
                .required('Harga motor harus diisi')
                .test('is-numeric', 'Invalid format', value => {
                    return value ? !isNaN(Number(value.replace(/\./g, ''))) : true;
                }),
            trunk_capacity: Yup.number().required('Kapasitas bagasi motor harus diisi'),
            fuel_capacity: Yup.number().required('Kapasitas bahan bakar motor harus diisi'),
        }),
        onSubmit: async (values) => {
            // Construct updated motorcycle object
            const motorcycle: CreateMotorcycleType = {
                model: values.model,
                year: Number(values.year),
                seats: Number(values.seats),
                manufacturer: values.manufacturer,
                price: Number(values.price.replace(/\./g, '')),
                trunk_capacity: Number(values.trunk_capacity),
                fuel_capacity: Number(values.fuel_capacity),
            }
            try {
                // Make an API request to create a new motorcycle
                const response = await createMotorcycle(motorcycle);
                if (response.status === 200) {
                    // Update the table data in the store with the new motorcycle
                    setTableData([...tableData, response.data.data as Motorcycle])
                    // Show success alert
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Motor berhasil ditambahkan',
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
                        text: 'Motor gagal ditambahkan',
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

    // Render the CreateMotorcycle component
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
            <dialog id="create-motorcycle-modal" className="modal">
                <div className="modal-box text-left">
                    <form method="dialog">
                        {/* Modal Close Button */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Form Tambah Mobil</h3>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <VehicleForm formik={formik} type='Motor' />
                        {/* Trunk Capacity */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Luas Bagasi</span>
                            </label>
                            <input
                                type="text"
                                placeholder="500"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.trunk_capacity && formik.errors.trunk_capacity ? 'input-error' : ''}`}
                                {...formik.getFieldProps('trunk_capacity')}
                                onInput={(event) => {
                                    // Replace non-digits
                                    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                                maxLength={5}
                            />
                            {formik.touched.trunk_capacity && formik.errors.trunk_capacity && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.trunk_capacity}</span>
                                </label>
                            )}
                        </div>
                        {/* Fuel Capacity */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Kapasitas Bensin</span>
                            </label>
                            <input
                                type="text"
                                placeholder="500"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.fuel_capacity && formik.errors.fuel_capacity ? 'input-error' : ''}`}
                                {...formik.getFieldProps('fuel_capacity')}
                                onInput={(event) => {
                                    // Replace non-digits
                                    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                                maxLength={5}
                            />
                            {formik.touched.fuel_capacity && formik.errors.fuel_capacity && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.fuel_capacity}</span>
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

export { CreateMotorcycle }