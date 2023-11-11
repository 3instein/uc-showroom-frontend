import { FC, useState, useEffect } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Customer } from '../interfaces/Customer';
import { CreateCustomer } from '../components/Customers/CreateCustomer';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { UpdateCustomer } from '../components/Customers/UpdateCustomer';

const Customers: FC = () => {

    const [customer, setCustomer] = useState<Customer>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)

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
            name: "Actions",
            cell: (row) =>
                <div className="flex justify-center space-x-2 py-1">
                    <button className="btn btn-outline btn-warning" onClick={() => {
                        setCustomer(row)
                        setShowUpdateModal(true)
                    }}>
                        <AiFillEdit />
                    </button>
                    <button className="btn btn-outline btn-error"><AiFillDelete /></button>
                </div>
        }
    ]

    const actions = [
        <CreateCustomer />
    ]

    useEffect(() => {
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-customer-modal-${customer?.id}`);

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
                apiURL='customers'
                actions={actions}
            />
            {showUpdateModal && <UpdateCustomer customer={customer!} />}
        </>
    )
}

export { Customers }