import { FC } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Car } from '../interfaces/Car';
import { customNumberFormat } from '../functions/general';

const Cars: FC = () => {

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
            selector: row => 'Rp. ' + customNumberFormat(row.price),
        }
    ]
    return (
        <MasterDataTable
            tableColumns={tableColumns}
            apiURL='cars'
        />
    )
}

export { Cars }