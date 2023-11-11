import { FC, ReactNode, useEffect, useState, Dispatch, SetStateAction } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDataTableStore } from "../../stores/DataTableStore";
import useSWR from 'swr';
import axios from "axios";

interface MasterDataTableProps {
    tableColumns: TableColumn<any>[]
    actions?: ReactNode[]
    apiURL: 'cars' | 'customers' | 'trucks' | 'motorcycles'
    setLoading?: Dispatch<SetStateAction<boolean>>
}


const MasterDataTable: FC<MasterDataTableProps> = ({ tableColumns, actions, apiURL, setLoading }) => {

    const BASE_URL = 'http://localhost:3000/'

    const fetcher = (url: string) => axios.get(url).then(res => res.data)

    const { data = [], error, isLoading, isValidating } = useSWR(BASE_URL + apiURL, fetcher)

    const [filterText, setFilterText] = useState('');

    const { tableData, setTableData, filteredTableData, setFilteredTableData, selectedFilters } = useDataTableStore();

    useEffect(() => {
        if (tableData) {
            setFilteredTableData(tableData.filter(item => {
                // Check filterText
                if (filterText) {
                    const filterWords = filterText.split(' ');

                    const isTextInValues = Object.values(item).some(val => {
                        return filterWords.every(word => {
                            const regexText = '.*' + word.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&') + '.*';
                            const regex = new RegExp(regexText, 'i');
                            return regex.test(String(val));
                        });
                    });

                    if (!isTextInValues) {
                        return false;
                    }
                }

                // Check each filter in selectedFilters
                for (const filterKey in selectedFilters) {
                    const filterValue = selectedFilters[filterKey];
                    if (filterValue !== "" && (item as any)[filterKey] !== filterValue) {
                        return false;  // If any filter doesn't match, don't include this item.
                    }
                }

                return true;  // If all filters match (or are empty), and date is in range (if applicable), include this item.
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, tableData, selectedFilters]);

    useEffect(() => {
        if (!isLoading) {
            setTableData(data.data)
            if (setLoading) {
                setLoading(false);
            }
        }
    }, [data])

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
                <h1>Server Error</h1>
                <p className="lead">Sorry, something went wrong on our end. We are working to fix the issue. Please try again later.</p>
            </div>
        </div>
    )

    return (
        <>
            <div className="card card-side bg-base-100 shadow-xl mb-5">
                {
                    isValidating &&
                    <div className="loading-overlay">
                        <div className="loader"></div>
                    </div>
                }
                <div className="card-body overflow-hidden">
                    <div className="flex justify-between">
                        <input
                            type="text"
                            placeholder="Cari"
                            className="input input-bordered w-1/5 max-w-xs"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <div>
                            {
                                actions && actions.map((action, index) => (
                                    <div key={index} className="me-5 me-md-3">
                                        {action}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <DataTable
                        columns={tableColumns}
                        data={
                            !isValidating ? filteredTableData : []
                        }
                        pagination
                    />
                </div>
            </div>
        </>
    )
}

export { MasterDataTable }