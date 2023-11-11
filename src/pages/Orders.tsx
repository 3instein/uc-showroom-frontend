import { FC, useState, useEffect } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useDataTableStore } from '../stores/DataTableStore';
import { Order } from '../interfaces/Order';
import { CreateOrder } from '../components/Orders/CreateOrder';
import { deleteOrder } from '../api/OrderCRUD';
import { customNumberFormat } from '../functions/general';
import { UpdateOrder } from '../components/Orders/UpdateOrder';

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
        // {
        //     name: "Address",
        //     selector: row => row.address,
        // },
        // {
        //     name: "Phone",
        //     selector: row => row.phone,
        // },
        // {
        //     name: "ID Card Number",
        //     selector: row => row.id_card_number,
        // },
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
                actions={actions}
            />
            {showUpdateModal && <UpdateOrder order={order!} />}
        </>
    )
}

export { Orders }