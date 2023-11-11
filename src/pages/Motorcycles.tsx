import { FC, useState, useEffect } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { customNumberFormat } from '../functions/general';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useDataTableStore } from '../stores/DataTableStore';
import { Motorcycle } from '../interfaces/Motorcycle';
import { deleteMotorcycle } from '../api/Motorcycle';
import { CreateMotorcycle } from '../components/Motorcycles/CreateMotorcycle';
import { UpdateMotorcycle } from '../components/Motorcycles/UpdateMotorcycle';

const Motorcycles: FC = () => {

    const [motorcycle, setMotorCycle] = useState<Motorcycle>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    const { tableData, setTableData } = useDataTableStore()

    const handleDelete = (motorcycle: Motorcycle) => {
        Swal.fire({
            title: `Apakah anda yakin ingin menghapus Motor ${motorcycle.model} tahun ${motorcycle.year} - ${motorcycle.manufacturer}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteMotorcycle(motorcycle.id)
                    if (response.status === 200) {
                        setTableData(tableData.filter((motorcycle) => motorcycle.id !== response.data.data.id))
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Motor berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Motor gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Motor ini telah mempunyai data pesanan!',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    })
                }
            }
        })
    }

    const tableColumns: TableColumn<Motorcycle>[] = [
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
            name: "Trunk Capacity",
            selector: row => row.trunk_capacity + "L",
        },
        {
            name: "Fuel Capacity",
            selector: row => row.fuel_capacity + "L",
        },
        {
            name: "Price",
            selector: row => row.price && 'Rp. ' + customNumberFormat(row.price),
        },
        {
            name: "Actions",
            cell: (row) =>
                <div className="flex justify-center space-x-2 py-1">
                    <button className="btn btn-outline btn-warning" onClick={() => {
                        setMotorCycle(row)
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
        <CreateMotorcycle />
    ]

    useEffect(() => {
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-motorcycle-modal-${motorcycle?.id}`);

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
                apiURL='motorcycles'
                actions={actions}
            />
            {showUpdateModal && <UpdateMotorcycle motorcycle={motorcycle!} />}
        </>
    )
}

export { Motorcycles }