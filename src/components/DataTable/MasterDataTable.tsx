import { FC, ReactNode, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDataTableStore } from "../../stores/DataTableStore";
import useSWR from 'swr';
import axios from "axios";

/**
 * Props for the MasterDataTable component.
 *
 * @interface MasterDataTableProps
 */
interface MasterDataTableProps {
    /**
     * An array of columns for the DataTable.
     * @type {TableColumn<any>[]}
     */
    tableColumns: TableColumn<any>[];

    /**
     * Optional actions to be displayed above the DataTable.
     * @type {ReactNode[]}
     */
    actions?: ReactNode[];

    /**
     * The API URL to fetch data from, e.g., 'cars', 'customers', 'trucks', 'motorcycles', 'orders'.
     * @type {'cars' | 'customers' | 'trucks' | 'motorcycles' | 'orders'}
     */
    apiURL: 'cars' | 'customers' | 'trucks' | 'motorcycles' | 'orders';

    /**
     * Indicates whether the DataTable should support expanded rows.
     * @type {boolean | undefined}
     */
    expanded?: boolean;

    /**
     * The component to render when a row is expanded.
     * @type {FC<any> | undefined}
     */
    expandedRowComponent?: FC<any>;
}

/**
 * A reusable DataTable component with integrated server-side rendering using SWR.
 *
 * @component
 * @param {MasterDataTableProps} props - The props for the MasterDataTable component.
 * @returns {JSX.Element}
 */

const MasterDataTable: FC<MasterDataTableProps> = ({ tableColumns, actions, apiURL, expanded, expandedRowComponent }) => {

    const BASE_URL = 'http://localhost:3000/'

    // Fetch data from the specified API URL using SWR.
    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const { data = [], error, isLoading, isValidating } = useSWR(BASE_URL + apiURL, fetcher)

    // State and functions from the DataTableStore for handling data and filters.
    const [filterText, setFilterText] = useState('');
    const { tableData, setTableData, filteredTableData, setFilteredTableData, selectedFilters } = useDataTableStore();

     // useEffect to filter and update data based on search text and filters.
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

    // useEffect to set tableData when data is successfully fetched.
    useEffect(() => {
        if (!isLoading) {
            setTableData(data.data)
        }
    }, [data])

    // Return UI based on error, loading state, or successful data retrieval.
    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
                <h1>Server Error</h1>
                <p className="lead">Sorry, something went wrong on our end. We are working to fix the issue. Please try again later.</p>
            </div>
        </div>
    )

    // Return the DataTable component with search input and optional actions.
    return (
        <>
            <div className="card card-side bg-base-100 shadow-xl mb-5">
                {
                    // If loading, show loading overlay.
                    isValidating &&
                    <div className="loading-overlay">
                        <div className="loader"></div>
                    </div>
                }
                <div className="card-body overflow-hidden">
                    <div className="flex justify-between">
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Cari"
                            className="input input-bordered w-1/5 max-w-xs"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <div>
                            {
                                // If actions exist, map them to the UI.
                                actions && actions.map((action, index) => (
                                    <div key={index} className="me-5 me-md-3">
                                        {action}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <DataTable
                        columns={tableColumns} // An array of columns for the DataTable.
                        data={
                            !isValidating ? filteredTableData : [] // If isValidating, show empty array to prevent DataTable from showing old data.
                        }
                        expandableRows={expanded} // If true, rows can be expanded to show a child component.
                        expandOnRowClicked={expanded} // If true, clicking anywhere on a row will expand it.
                        highlightOnHover={expanded} // If true, the row under the cursor will be highlighted.
                        expandableRowsComponent={expandedRowComponent} // The component to render when a row is expanded.
                        pagination // If true, pagination is enabled.
                    />
                </div>
            </div>
        </>
    )
}

export { MasterDataTable }