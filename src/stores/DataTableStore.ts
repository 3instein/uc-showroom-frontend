/* eslint-disable no-unused-vars */
// Import the create function from 'zustand'
import { create } from 'zustand';

// Define the types for the store state
type DataTableState = {
    tableData: any[];
    filteredTableData: any[];
    selectedFilters: { [key: string]: string }; // Here's where the change happens
    setTableData: (tableData: any[]) => void;
    setFilteredTableData: (filteredTableData: any[]) => void;
    setSelectedFilter: (filterType: string, value: string) => void;
}

// Create and export the useDataTableStore hook
export const useDataTableStore = create<DataTableState>((set) => ({
    // Initial state with empty tableData, filteredTableData, and default selected filter
    tableData: [],
    filteredTableData: [],
    selectedFilters: {
        status: '', // Default selected filter (example: 'status')
    },

    // Function to set the tableData state
    setTableData: (tableData) => {
        set({ tableData });
    },

    // Function to set the filteredTableData state
    setFilteredTableData: (filteredTableData) => {
        set({ filteredTableData });
    },

     // Function to set the selectedFilters state based on filterType and value
    setSelectedFilter: (filterType, value) => {
        set(state => ({
            selectedFilters: {
                ...state.selectedFilters,
                [filterType]: value
            }
        }))
    },
}));
