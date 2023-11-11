import { FC, useState } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Car } from '../interfaces/Car';
import { customNumberFormat } from '../functions/general';
import { CreateCar } from '../components/Cars/CreateCar';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { deleteCar } from '../api/CarCRUD';
import { useDataTableStore } from '../stores/DataTableStore';

const Cars: FC = () => {

    const [car, setCar] = useState<Car>()
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    const {tableData, setTableData} = useDataTableStore()

    const handleDelete = (car: Car) => {
        Swal.fire({
            title: `Apakah anda yakin ingin menghapus mobil ${car.model} tahun ${car.year} - ${car.manufacturer}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteCar(car.id)
                    if (response.status === 200) {
                        setTableData(tableData.filter((customer) => customer.id !== response.data.data.id))
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Mobil berhasil dihapus',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        })
                    } else {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Mobil gagal dihapus',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Mobil gagal dihapus',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    })
                }
            }
        })
    }

    const tableColumns: TableColumn<Car>[] = [
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
            name: "Fuel Type",
            selector: row => row.fuel_type
        },
        {
            name: "Trunk Capacity",
            selector: row => row.trunk_capacity + "L",
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
                        setCar(row)
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
        <CreateCar />
    ]
    return (
        <MasterDataTable
            tableColumns={tableColumns}
            apiURL='cars'
            actions={actions}
        />
    )
}

export { Cars }