// Import necessary dependencies from React
import { FC, useState, useEffect } from 'react';
// Import components and utilities
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Customer } from '../interfaces/Customer';
import { CreateCustomer } from '../components/Customers/CreateCustomer';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { UpdateCustomer } from '../components/Customers/UpdateCustomer';
import Swal from 'sweetalert2';
import { deleteCustomer } from '../api/CustomerCRUD';
import { useDataTableStore } from '../stores/DataTableStore';

// Define the Customers functional component
const Customers: FC = () => {
    // State variables
    const [customer, setCustomer] = useState<Customer>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const { tableData, setTableData } = useDataTableStore()

    // Handle customer deletion
    const handleDelete = (customer: Customer) => {
        // Display a confirmation dialog using Swal
        Swal.fire({
            title: `Apakah anda yakin ingin menghapus ${customer.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteCustomer(customer.id)
                    // Handle the response from the server
                    if (response.status === 200) {
                        // Update the tableData state to reflect the deletion
                        setTableData(tableData.filter((customer) => customer.id !== response.data.data.id))
                        // Display a success message
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Customer berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        // Display an error message if deletion fails
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Customer gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
                    // Display an error message if the customer has existing orders
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Customer ini telah mempunyai pesanan!',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    })
                }
            }
        })
    }

    // Define table columns with specific renderings
    const tableColumns: TableColumn<Customer>[] = [
        {
            name: "Name",
            selector: row => row.name,
        },
        {
            name: "Address",
            selector: row => row.address,
        },
        {
            name: "Phone",
            selector: row => row.phone,
        },
        {
            name: "ID Card Number",
            selector: row => row.id_card_number,
        },
        {
            name: "ID Card Image",
            cell: (row) => <img src={row.id_card_photo} alt="id_card_image" className="h-20" />
        },
        // Custom cell rendering for actions column
        {
            name: "Actions",
            cell: (row) =>
                <div className="flex justify-center space-x-2 py-1">
                    <button className="btn btn-outline btn-warning" onClick={() => {
                        setCustomer(row)
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
        <CreateCustomer />
    ]

    // Effect for handling modal visibility
    useEffect(() => {
        // Check if the update modal should be shown
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-customer-modal-${customer?.id}`);

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
                apiURL='customers'
                actions={actions}
            />
            {showUpdateModal && <UpdateCustomer customer={customer!} />}
        </>
    )
}

export { Customers }