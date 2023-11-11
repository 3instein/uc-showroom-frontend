import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Car, CreateCar as CreateCarType } from '../../interfaces/Car';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';
import { createCar } from '../../api/CarCRUD';
import { VehicleForm } from '../Form/VehicleForm';

const CreateCar: FC = () => {

    const { tableData, setTableData } = useDataTableStore()

    const modal = document.getElementById('create-car-modal');

    const formik = useFormik({
        initialValues: {
            model: '',
            year: '',
            seats: '',
            manufacturer: '',
            price: '',
            fuel_type: '',
            trunk_capacity: '',
        },
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
            const car: CreateCarType = {
                model: values.model,
                year: Number(values.year),
                seats: Number(values.seats),
                manufacturer: values.manufacturer,
                price: Number(values.price.replace(/\./g, '')),
                fuel_type: values.fuel_type,
                trunk_capacity: Number(values.trunk_capacity),
            }
            try {
                const response = await createCar(car);
                if (response.status === 200) {
                    setTableData([...tableData, response.data.data as Car])
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Mobil berhasil ditambahkan',
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
                        text: 'Mobil gagal ditambahkan',
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
            <dialog id="create-car-modal" className="modal">
                <div className="modal-box text-left">
                    <form method="dialog">
                        {/* Modal Close Button */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Form Tambah Mobil</h3>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <VehicleForm formik={formik} />
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
                            />
                            {formik.touched.trunk_capacity && formik.errors.trunk_capacity && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.trunk_capacity}</span>
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

export { CreateCar }