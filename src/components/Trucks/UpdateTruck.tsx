import { FC } from 'react';
import { VehicleForm } from '../Form/VehicleForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { customNumberFormat } from '../../functions/general';
import { Truck } from '../../interfaces/Truck';
import { updateTruck } from '../../api/TruckCRUD';

interface UpdateTruckProps {
    truck: Truck
}

const UpdateTruck: FC<UpdateTruckProps> = ({ truck }) => {

    const modal = document.getElementById(`update-truck-modal-${truck.id}`);
    const { tableData, setTableData } = useDataTableStore()

    const formik = useFormik({
        initialValues: {
            model: truck.model,
            year: truck.year,
            seats: truck.seats,
            manufacturer: truck.manufacturer,
            price: customNumberFormat(truck.price),
            wheels: truck.wheels,
            cargo_capacity: truck.cargo_capacity,
        },
        validationSchema: Yup.object({
            model: Yup.string().required('Model truck harus diisi'),
            year: Yup.number().required('Tahun truck harus diisi'),
            seats: Yup.number().required('Jumlah kursi harus diisi'),
            manufacturer: Yup.string().required('Merk truck harus diisi'),
            price: Yup.string()
                .required('Harga truck harus diisi')
                .test('is-numeric', 'Invalid format', value => {
                    return value ? !isNaN(Number(value.replace(/\./g, ''))) : true;
                }),
            wheels: Yup.string().required('Jumlah roda truk harus diisi'),
            cargo_capacity: Yup.number().required('Luas area kargo truk harus diisi'),
        }),
        onSubmit: async (values) => {
            const updatedTruck: Truck = {
                id: truck.id,
                model: values.model,
                year: Number(values.year),
                seats: Number(values.seats),
                manufacturer: values.manufacturer,
                price: Number(values.price.replace(/\./g, '')),
                wheels: Number(values.wheels),
                cargo_capacity: Number(values.cargo_capacity),
            }
            try {
                const response = await updateTruck(updatedTruck);
                if (response.status === 200) {
                    setTableData(tableData.map((truck) => {
                        if (truck.id === updatedTruck.id) {
                            return updatedTruck
                        }
                        return truck
                    }))
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Truck berhasil diupdate',
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
                        text: 'Truck gagal diupdate',
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
        <dialog id={`update-truck-modal-${truck.id}`} className="modal">
            <div className="modal-box text-left">
                <form method="dialog">
                    {/* Modal Close Button */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Form Update Mobil</h3>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <VehicleForm formik={formik} type='Mobil' />
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

export { UpdateTruck }