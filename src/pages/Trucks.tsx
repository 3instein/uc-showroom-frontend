import { FC, useState, useEffect } from 'react';
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

const Trucks: FC = () => {

    const [truck, setTruck] = useState<Truck>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    const { tableData, setTableData } = useDataTableStore()

    const handleDelete = (truck: Truck) => {
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
                    if (response.status === 200) {
                        setTableData(tableData.filter((truck) => truck.id !== response.data.data.id))
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Truk berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Truk gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
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

    const actions = [
        <CreateTruck />
    ]

    useEffect(() => {
        if (showUpdateModal) {
            const updateBannerModal = document.getElementById(`update-truck-modal-${truck?.id}`);

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
                apiURL='trucks'
                actions={actions}
            />
            {showUpdateModal && <UpdateTruck truck={truck!} />}
        </>
    )
}

export { Trucks }