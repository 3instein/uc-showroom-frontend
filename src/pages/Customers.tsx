import { FC } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Customer } from '../interfaces/Customer';
import { CreateCustomer } from '../components/Customers/CreateCustomer';

const Customers: FC = () => {

    const tableColumns: TableColumn<Customer>[] = [
        {
            name: "name",
            selector: row => row.name,
        }
    ]

    const actions = [
        <CreateCustomer />
    ]
    return (
        <MasterDataTable
            tableColumns={tableColumns}
            apiURL='customers'
            actions={actions}
        />
    )
}

export { Customers }