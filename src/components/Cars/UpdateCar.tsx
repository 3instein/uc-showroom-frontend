import { FC } from 'react';
import { VehicleForm } from '../Form/VehicleForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Car } from '../../interfaces/Car';
import { updateCar } from '../../api/CarCRUD';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { customNumberFormat } from '../../functions/general';

/**
 * Props for the UpdateCar component.
 *
 * @interface UpdateCarProps
 */
interface UpdateCarProps {
    car: Car; // The car data to be updated
}

/**
 * UpdateCar component allows users to update details of a car.
 *
 * @component
 * @param {UpdateCarProps} props - The properties of the component.
 * @returns {JSX.Element} - The rendered UpdateCar component.
 */

const UpdateCar: FC<UpdateCarProps> = ({car}) => {
    // Access the moda elemetn by using car.id
    const modal = document.getElementById(`update-car-modal-${car.id}`);
    // Access the DataTable store to update the table data
    const {tableData, setTableData} = useDataTableStore()

    // Formik hook for form management and validation
    const formik = useFormik({
        initialValues: {
            model: car.model,
            year: car.year,
            seats: car.seats,
            manufacturer: car.manufacturer,
            price: customNumberFormat(car.price),
            fuel_type: car.fuel_type,
            trunk_capacity: car.trunk_capacity,
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
            fuel_type: Yup.string().required('Jenis bahan bakar mobil harus diisi'),
            trunk_capacity: Yup.number().required('Kapasitas bagasi mobil harus diisi'),
        }),
        onSubmit: async (values) => {
            // Construct updated car object
            const updatedCar: Car = {
                id: car.id,
                model: values.model,
                year: Number(values.year),
                seats: Number(values.seats),
                manufacturer: values.manufacturer,
                price: Number(values.price.replace(/\./g, '')),
                fuel_type: values.fuel_type,
                trunk_capacity: Number(values.trunk_capacity),
            }
            try {
                // Attempt to update car via API
                const response = await updateCar(updatedCar);
                if (response.status === 200) {
                    // Update local tableData with the updated car
                    setTableData(tableData.map((car) => {
                        if (car.id === updatedCar.id) {
                            return updatedCar
                        }
                        return car
                    }))
                    // Show success message
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Mobil berhasil diupdate',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: modal
                    }).then(() => {
                        // Close the modal
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    // Show error message
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Mobil gagal diupdate',
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

    // Render the UpdateCar component
    return (
        <dialog id={`update-car-modal-${car.id}`} className="modal">
            <div className="modal-box text-left">
                <form method="dialog">
                    {/* Modal Close Button */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Form Update Mobil</h3>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <VehicleForm formik={formik} type='Mobil' />
                    {/* Fuel Type */}
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text font-bold">Tipe Bahan Bakar</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nama Bahan Bakar"
                            className={`input input-bordered w-full max-w-xs ${formik.touched.fuel_type && formik.errors.fuel_type ? 'input-error' : ''}`}
                            {...formik.getFieldProps('fuel_type')}
                        />
                        {formik.touched.fuel_type && formik.errors.fuel_type && (
                            <label className="label pt-1">
                                <span className="label-text text-xs text-red-600">{formik.errors.fuel_type}</span>
                            </label>
                        )}
                    </div>
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

export { UpdateCar }