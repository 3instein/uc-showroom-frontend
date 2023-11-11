import { FC } from 'react';
import { VehicleForm } from '../Form/VehicleForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { customNumberFormat } from '../../functions/general';
import { Motorcycle } from '../../interfaces/Motorcycle';
import { updateMotorcycle } from '../../api/MotorcycleCRUD';

interface UpdateMotorcycleProps {
    motorcycle: Motorcycle
}

/**
 * Functional component for updating motorcycle details.
 *
 * @component
 * @param {UpdateMotorcycleProps} props - Props containing the motorcycle details.
 * @returns {JSX.Element}
 */
const UpdateMotorcycle: FC<UpdateMotorcycleProps> = ({ motorcycle }) => {
    // Reference to the modal element
    const modal = document.getElementById(`update-motorcycle-modal-${motorcycle.id}`);
    // Access the DataTable store to update the table data
    const { tableData, setTableData } = useDataTableStore()

    // Formik hook for form management and validation
    const formik = useFormik({
        initialValues: {
            model: motorcycle.model,
            year: motorcycle.year,
            seats: motorcycle.seats,
            manufacturer: motorcycle.manufacturer,
            price: customNumberFormat(motorcycle.price),
            trunk_capacity: motorcycle.trunk_capacity,
            fuel_capacity: motorcycle.fuel_capacity,
        },
        // Validation schema for form fields
        validationSchema: Yup.object({
            model: Yup.string().required('Model mobil harus diisi'),
            year: Yup.number().required('Tahun mobil harus diisi'),
            seats: Yup.number().required('Jumlah kursi harus diisi'),
            manufacturer: Yup.string().required('Merk mobil harus diisi'),
            price: Yup.string()
                .required('Harga mobil harus diisi')
                .test('is-numeric', 'Invalid format', value => {
                    return value ? !isNaN(Number(value.replace(/\./g, ''))) : true;
                }),
            trunk_capacity: Yup.number().required('Kapasitas bagasi mobil harus diisi'),
            fuel_capacity: Yup.number().required('Kapasitas bahan bakar motor harus diisi'),
        }),
        onSubmit: async (values) => {
            // Construct updated motorcycle object
            const updatedMotorcycle: Motorcycle = {
                id: motorcycle.id,
                model: values.model,
                year: Number(values.year),
                seats: Number(values.seats),
                manufacturer: values.manufacturer,
                price: Number(values.price.replace(/\./g, '')),
                trunk_capacity: Number(values.trunk_capacity),
                fuel_capacity: Number(values.fuel_capacity),
            }
            try {
                // Make an API request to update the motorcycle
                const response = await updateMotorcycle(updatedMotorcycle);
                if (response.status === 200) {
                    // Update the table data in the store with the updated motorcycle
                    setTableData(tableData.map((motorcycle) => {
                        if (motorcycle.id === updatedMotorcycle.id) {
                            return updatedMotorcycle
                        }
                        return motorcycle
                    }))
                    // Show success message
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Motor berhasil diupdate',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: modal
                    }).then(() => {
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    // Show error message
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Motor gagal diupdate',
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

    // Render the UpdateMotorcycle component
    return (
        <dialog id={`update-motorcycle-modal-${motorcycle.id}`} className="modal">
            <div className="modal-box text-left">
                <form method="dialog">
                    {/* Modal Close Button */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Form Update Mobil</h3>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <VehicleForm formik={formik} type='Mobil' />
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
                    <button type='submit' className='btn btn-primary float-right'>Update</button>
                </form>
            </div>
            {/* Modal Backdrop Close */}
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}

export { UpdateMotorcycle }