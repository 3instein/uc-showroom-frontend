import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FC } from 'react';
import { updateCustomer } from '../../api/CustomerCRUD';
import { Customer } from '../../interfaces/Customer';
import { useDataTableStore } from '../../stores/DataTableStore';
import Swal from 'sweetalert2';

interface UpdateCustomerProps {
    customer: Customer
}

const UpdateCustomer: FC<UpdateCustomerProps> = ({ customer }) => {

    const { tableData, setTableData } = useDataTableStore()

    const updateCustomerModal = document.getElementById(`update-customer-modal-${customer.id}`);

    const formik = useFormik({
        initialValues: {
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            id_card_number: customer.id_card_number,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nama harus diisi'),
            address: Yup.string().required('Alamat harus diisi'),
            phone: Yup.string().required('Nomor telepon harus diisi'),
            id_card_number: Yup.string().required('Nomor KTP harus diisi'),
        }),
        onSubmit: async (values) => {
            const updatedCustomer: Customer = {
                id: customer.id,
                name: values.name,
                address: values.address,
                phone: values.phone,
                id_card_number: values.id_card_number,
            }
            try {
                const response = await updateCustomer(updatedCustomer);
                if (response.status === 200) {
                    setTableData(tableData.map((customer) => {
                        if (customer.id === updatedCustomer.id) {
                            return updatedCustomer
                        }
                        return customer
                    }))
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Customer berhasil diupdate',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        target: updateCustomerModal
                    }).then(() => {
                        const modal = updateCustomerModal
                        if (modal instanceof HTMLDialogElement) {
                            modal.close()
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Customer gagal diupdate',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        target: document.getElementById('create-customer-modal') as HTMLElement
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <>
            <dialog id={`update-customer-modal-${customer.id}`} className="modal">
                <div className="modal-box text-left">
                    <form method="dialog">
                        {/* Modal Close Button */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Form Update Customer</h3>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        {/* Name */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Nama</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nama Customer"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.name}</span>
                                </label>
                            )}
                        </div>
                        {/* Alamat */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">Alamat</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Alamat Customer"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.address && formik.errors.address ? 'input-error' : ''}`}
                                {...formik.getFieldProps('address')}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.address}</span>
                                </label>
                            )}
                        </div>
                        {/* Phone */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">No. Telepon</span>
                            </label>
                            <input
                                type="text"
                                placeholder="08123456789"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.phone && formik.errors.phone ? 'input-error' : ''}`}
                                {...formik.getFieldProps('phone')}
                                onInput={(event) => {
                                    // Replace non-digits
                                    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.phone}</span>
                                </label>
                            )}
                        </div>
                        {/* ID Card Number */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text font-bold">NIK</span>
                            </label>
                            <input
                                type="text"
                                placeholder="3578xxxxxxxxxxxx"
                                className={`input input-bordered w-full max-w-xs ${formik.touched.id_card_number && formik.errors.id_card_number ? 'input-error' : ''}`}
                                {...formik.getFieldProps('id_card_number')}
                                onInput={(event) => {
                                    // Replace non-digits
                                    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            {formik.touched.id_card_number && formik.errors.id_card_number && (
                                <label className="label pt-1">
                                    <span className="label-text text-xs text-red-600">{formik.errors.id_card_number}</span>
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
        </>
    )
}

export { UpdateCustomer }