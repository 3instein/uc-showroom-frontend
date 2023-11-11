import { FC } from 'react';
import { MasterDataTable } from '../components/DataTable/MasterDataTable';
import { TableColumn } from 'react-data-table-component';
import { Customer } from '../interfaces/Customer';
import { CreateCustomer } from '../components/Customers/CreateCustomer';

const Customers: FC = () => {

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