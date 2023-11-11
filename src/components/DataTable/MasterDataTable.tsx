import { FC, ReactNode, useEffect, useState, Dispatch, SetStateAction } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDataTableStore } from "../../stores/DataTableStore";
import useSWR from 'swr';
import axios from "axios";

interface MasterDataTableProps {
    tableColumns: TableColumn<any>[]
    actions?: ReactNode[]
    apiURL: 'cars'
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
            <div className="card rounded">
                {
                    (isLoading || isValidating) &&
                    <div className="loading-overlay">
                        <div className="loader"></div>
                    </div>
                }
                <div className="card-header border-0 pt-6">
                    <div className="card-title">
                        <div className="d-flex align-items-center position-relative my-1 skeleton-button" id="divSearch">
                            <span className="svg-icon svg-icon-1 position-absolute ms-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                                    <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                data-kt-lists-table-filter="search"
                                className="form-control form-control-solid w-210px ps-15 skeleton"
                                placeholder="Cari"
                                id="inputSearch"
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="card-toolbar align-self-center">
                        {
                            actions && actions.map((action, index) => (
                                <div key={index} className="me-5 me-md-3">
                                    {action}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="card-body pt-0">
                    <DataTable
                        columns={tableColumns}
                        data={
                            !isLoading ? filteredTableData : []
                        }
                        pagination
                    />
                </div>
            </div>
        </>
    )
}

export { MasterDataTable }