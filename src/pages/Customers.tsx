import { FC } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Customer } from '../interfaces/Customer';

const Customers: FC = () => {

    const tableColumns: TableColumn<Customer>[] = [
        {
            name: "name",
            selector: row => row.name,
        }
    ]
    return (
        <MasterDataTable
            tableColumns={tableColumns}
            apiURL='customers'
        />
    )
}

export { Customers }