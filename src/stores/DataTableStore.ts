/* eslint-disable no-unused-vars */
import { create } from 'zustand';

type DataTableState = {
    tableData: any[];
    filteredTableData: any[];
    selectedFilters: { [key: string]: string }; // Here's where the change happens
    setTableData: (tableData: any[]) => void;
    setFilteredTableData: (filteredTableData: any[]) => void;
    setSelectedFilter: (filterType: string, value: string) => void;
}

export const useDataTableStore = create<DataTableState>((set) => ({
    tableData: [],
    filteredTableData: [],
    selectedFilters: {
        status: '',
    },

    setTableData: (tableData) => {
        set({ tableData });
    },

    setFilteredTableData: (filteredTableData) => {
        set({ filteredTableData });
    },

    setSelectedFilter: (filterType, value) => {
        set(state => ({
            selectedFilters: {
                ...state.selectedFilters,
                [filterType]: value
            }
        }))
    },
}));
