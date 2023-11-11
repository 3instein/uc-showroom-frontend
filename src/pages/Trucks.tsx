// Import necessary dependencies from React 
import { FC, useState, useEffect } from 'react';
// Import components and utilities
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { customNumberFormat } from '../functions/general';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useDataTableStore } from '../stores/DataTableStore';
import { Truck } from '../interfaces/Truck';
import { deleteTruck } from '../api/TruckCRUD';
import { CreateTruck } from '../components/Trucks/CreateTruck';
import { UpdateTruck } from '../components/Trucks/UpdateTruck';

// Define the Trucks functional component
const Trucks: FC = () => {
    // State variables
    const [truck, setTruck] = useState<Truck>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    // Access the tableData and setTableData functions from the DataTableStore
    const { tableData, setTableData } = useDataTableStore()

    // Handle truck deletion
    const handleDelete = (truck: Truck) => {
        // Display a confirmation dialog using Swal
        Swal.fire({
            title: `Apakah anda yakin ingin menghapus Truk ${truck.model} tahun ${truck.year} - ${truck.manufacturer}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteTruck(truck.id)
                    // Handle the response from the server
                    if (response.status === 200) {
                        // Update the tableData state to reflect the deletion
                        setTableData(tableData.filter((truck) => truck.id !== response.data.data.id))
                        // Display a success message
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Truk berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        // Display an error message if deletion fails
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Truk gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
                    // Display an error message if the truck has existing order data
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Truk ini telah mempunyai data pesanan!',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    })
                }
            }
        })
    }

    // Define table columns with specific renderings
    const tableColumns: TableColumn<Truck>[] = [
        {
            name: "Model",
            selector: row => row.model,
        },
        {
            name: "Year",
            selector: row => row.year,
        },
        {
            name: "Seats",
            selector: row => row.seats,
        },
        {
            name: "Manufacturer",
            selector: row => row.manufacturer,
        },
        {
            name: "Wheels",
            selector: row => row.wheels
        },
        {
            name: "Cargo Capacity",
            selector: row => row.cargo_capacity + "L",
        },
        {
            name: "Price",
            selector: row => row.price && 'Rp. ' + customNumberFormat(row.price),
        },
        // Custom cell rendering for actions column
        {
            name: "Actions",
            cell: (row) =>
                <div className="flex justify-center space-x-2 py-1">
                    <button className="btn btn-outline btn-warning" onClick={() => {
                        setTruck(row)
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
        <CreateTruck />
    ]

    // Effect for handling modal visibility
    useEffect(() => {
        // Check if the update modal should be shown
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-truck-modal-${truck?.id}`);

            // Check if the modal element exists
            if (updateBannerModal) {
                if (updateBannerModal instanceof HTMLDialogElement) {
                    // Show the modal
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
                apiURL='trucks'
                actions={actions}
            />
            {showUpdateModal && <UpdateTruck truck={truck!} />}
        </>
    )
}

export { Trucks }