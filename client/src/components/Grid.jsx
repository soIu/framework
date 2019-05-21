import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default class extends React.Component {
  render(props) {
    return (
      <div style={{height: '100%'}} className="ag-theme-material">
        <AgGridReact rowSelection="multiple" paginationPageSize={props.paginationPageSize} pagination enableColResize enableServerSideSorting enableServerSideFilter  suppressMultiSort suppressRowClickSelection onGridReady={props.onGridReady} onRowClicked={props.onRowClicked} onPaginationChanged={props.onPaginationChanged} onSortChanged={props.onSortChanged} onFilterChanged={props.onFilterChanged} columnDefs={props.columnDefs} rowData={props.rowData}/>
      </div>
    );
  }
}
