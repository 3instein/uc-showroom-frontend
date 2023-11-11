import { FC, useState, useEffect } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { ExpanderComponentProps, TableColumn } from 'react-data-table-component';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useDataTableStore } from '../stores/DataTableStore';
import { Order } from '../interfaces/Order';
import { CreateOrder } from '../components/Orders/CreateOrder';
import { deleteOrder } from '../api/OrderCRUD';
import { customNumberFormat } from '../functions/general';
import { UpdateOrder } from '../components/Orders/UpdateOrder';

interface Props extends ExpanderComponentProps<Order> {
    // currently, props that extend ExpanderComponentProps must be set to optional.
    name?: string;
}

const ExpandadbleRowComponent: FC<Props> = ({ data }) => {

    const vehicle_type = data.vehicle_type === 'car' ? 'Mobil' : data.vehicle_type === 'truck' ? 'Truk' : 'Motor'
    const vehicle_model = data.vehicle_type === 'car' ? data.car?.model : data.vehicle_type === 'truck' ? data.truck?.model : data.motorcycle?.model
    const vehicle_year = data.vehicle_type === 'car' ? data.car?.year : data.vehicle_type === 'truck' ? data.truck?.year : data.motorcycle?.year
    const vehicle_seats = data.vehicle_type === 'car' ? data.car?.seats : data.vehicle_type === 'truck' ? data.truck?.seats : data.motorcycle?.seats
    const vehicle_manufacturer = data.vehicle_type === 'car' ? data.car?.manufacturer : data.vehicle_type === 'truck' ? data.truck?.manufacturer : data.motorcycle?.manufacturer

    return (
        <>
            <div className="float-left text-left p-5">
                <h1 className='text-lg font-bold'>Data Pelanggan</h1>
                <p>Nama Pelanggan : {data.customer.name}</p>
                <p>Alamat Pelanggan: {data.customer.address}</p>
                <p>Nomor Telepon Pelanggan: {data.customer.phone}</p>
            </div>
            <div className="float-left text-left p-5">
                <h1 className='text-lg font-bold'>Data Kendaraan</h1>
                <p>Model {vehicle_type} : {vehicle_model}</p>
                <p>Tahun : {vehicle_year}</p>
                <p>Jumlah Penumpang: {vehicle_seats}</p>
                <p>Manufaktur: {vehicle_manufacturer}</p>
            </div>
            <div className="float-left text-left p-5">
                <h1 className='text-lg font-bold'>Spesifikasi Detail {vehicle_type}</h1>
                {
                    data.vehicle_type === 'car' ?
                        <>
                            <p>Tipe Bahan Bakar: {data.car?.fuel_type}</p>
                            <p>Luas Bagasi: {data.car?.trunk_capacity}L</p>
                        </>
                        : data.vehicle_type === 'truck' ?
                            <>
                                <p>Jumlah Roda: {data.truck?.wheels}</p>
                                <p>Kapasitas Kargo: {data.truck?.cargo_capacity}L</p>
                            </>
                            :
                            data.vehicle_type === 'motorcycle' &&
                            <>
                                <p>Luas Bagasi: {data.motorcycle?.trunk_capacity}L</p>
                                <p>Kapasitas Bensin: {data.motorcycle?.fuel_capacity}L</p>
                            </>
                }
            </div>
        </>
    )
}

const Orders: FC = () => {

    const [order, setOrder] = useState<Order>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const { tableData, setTableData } = useDataTableStore()

    const handleDelete = (order: Order) => {
        Swal.fire({
            title: `Apakah anda yakin ingin menghapus Order - ${order.customer.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteOrder(order.id, order.vehicle_type)
                    if (response.status === 200) {
                        setTableData(tableData.filter((order) => order.id !== response.data.data.id))
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Order berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Order gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Order gagal dihapus',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    })
                }
            }
        })
    }

    const tableColumns: TableColumn<Order>[] = [
        {
            name: "Customer Name",
            selector: row => row.customer && row.customer.name,
        },
        {
            name: "Vehicle Type",
            selector: row => row.vehicle_type === 'car' ? 'Mobil' : row.vehicle_type === 'truck' ? 'Truk' : 'Motor',
        },
        {
            name: "Payment",
            selector: row => row.vehicle_price && 'Rp. ' + customNumberFormat(row.vehicle_price),
        },
        {
            name: "Actions",
            cell: (row) =>
                <div className="flex justify-center space-x-2 py-1">
                    <button className="btn btn-outline btn-warning" onClick={() => {
                        setOrder(row)
                        setShowUpdateModal(true)
                    }}>
                        <AiFillEdit />
                    </button>
                    <button className="btn btn-outline btn-error" onClick={() => { handleDelete(row) }}>
                        <AiFillDelete />
                    </button>
                </div>
        }
    ]

    const actions = [
        <CreateOrder />
    ]

    useEffect(() => {
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-order-modal-${order?.id}`);

            if (updateBannerModal) {
                if (updateBannerModal instanceof HTMLDialogElement) {
                    updateBannerModal.showModal();
                }

                // This listener sets showChat to false when the modal is closed
                const handleModalHide = () => {
                    setShowUpdateModal(false);
                };

                // Attach the event listener
                updateBannerModal.addEventListener('close', handleModalHide);

                // Clean up the listener when the component is unmounted or if showChat/chatHistory changes
                return () => {
                    updateBannerModal.removeEventListener('close', handleModalHide);
                };
            }
        }
    }, [showUpdateModal, setShowUpdateModal]);
    return (
        <>
            <MasterDataTable
                tableColumns={tableColumns}
                apiURL='orders'
                expanded
                expandedRowComponent={ExpandadbleRowComponent}
                actions={actions}
            />
            {showUpdateModal && <UpdateOrder order={order!} />}
        </>
    )
}

export { Orders }