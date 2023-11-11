// Import necessary dependencies from React
import { FC, useState, useEffect } from 'react';
// Import components and utilities
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

// Define props for the expandable row component
interface Props extends ExpanderComponentProps<Order> {
    // currently, props that extend ExpanderComponentProps must be set to optional.
    name?: string;
}

// Define the ExpandableRowComponent functional component
const ExpandadbleRowComponent: FC<Props> = ({ data }) => {
    // Extract relevant data based on the vehicle type
    const vehicle_type = data.vehicle_type === 'car' ? 'Mobil' : data.vehicle_type === 'truck' ? 'Truk' : 'Motor'
    const vehicle_model = data.vehicle_type === 'car' ? data.car?.model : data.vehicle_type === 'truck' ? data.truck?.model : data.motorcycle?.model
    const vehicle_year = data.vehicle_type === 'car' ? data.car?.year : data.vehicle_type === 'truck' ? data.truck?.year : data.motorcycle?.year
    const vehicle_seats = data.vehicle_type === 'car' ? data.car?.seats : data.vehicle_type === 'truck' ? data.truck?.seats : data.motorcycle?.seats
    const vehicle_manufacturer = data.vehicle_type === 'car' ? data.car?.manufacturer : data.vehicle_type === 'truck' ? data.truck?.manufacturer : data.motorcycle?.manufacturer

    // Return the JSX for the expandable row
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

// Define the Orders functional component
const Orders: FC = () => {
    // State variables
    const [order, setOrder] = useState<Order>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    // Access the tableData and setTableData functions from the DataTableStore
    const { tableData, setTableData } = useDataTableStore()

    // Handle order deletion
    const handleDelete = (order: Order) => {
        // Display a confirmation dialog using Swal
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
                    // Handle the response from the server
                    if (response.status === 200) {
                        // Update the tableData state to reflect the deletion
                        setTableData(tableData.filter((order) => order.id !== response.data.data.id))
                        // Display a success message
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Order berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        // Display an error message if deletion fails
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Order gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
                    // Display an error message if the order has existing order data
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

    // Define table columns with specific renderings
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
        // Custom cell rendering for the Actions column
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

    // Actions to be displayed above the table
    const actions = [
        <CreateOrder />
    ]

    // Effect for handling modal visibility
    useEffect(() => {
        // Check if the modal should be shown
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-order-modal-${order?.id}`);

            // Check if the modal exists
            if (updateBannerModal) {
                if (updateBannerModal instanceof HTMLDialogElement) {
                    updateBannerModal.showModal();
                }

                // Event listener for modal close
                const handleModalHide = () => {
                    setShowUpdateModal(false);
                };

                // Attach the event listener
                updateBannerModal.addEventListener('close', handleModalHide);

                // Clean up the listener when the component is unmounted or if showUpdateModal changes
                return () => {
                    updateBannerModal.removeEventListener('close', handleModalHide);
                };
            }
        }
    }, [showUpdateModal, setShowUpdateModal]);

    // Render the MasterDataTable with specified columns, API URL, and actions
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