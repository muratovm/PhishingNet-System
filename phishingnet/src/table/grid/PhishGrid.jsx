
import React, { Component } from 'react';
import { render } from '@testing-library/react';
import '../../App.css';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Typography from '@material-ui/core/Typography';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
export const API_URL = "http://192.168.2.12:8000/api/encounters/";

let global_width = 400;

function DaysFrostRenderer() {
  this.eGui = document.createElement("div");
}

DaysFrostRenderer.prototype.init = function(params) {
  this.value = params.value;
  this.rendererImage = params.rendererImage;
  
  this.updateImages();
};

DaysFrostRenderer.prototype.updateImages = function() {
  var imageElement = document.createElement("img");
  imageElement.src = this.value;
  let offset = 50;
  imageElement.width = global_width-offset;
  imageElement.height = (global_width-offset)*9/16;
  imageElement.onclick = () => window.open(imageElement.src);
  this.eGui.appendChild(imageElement)
};
DaysFrostRenderer.prototype.getGui = function getGui() {
  return this.eGui;
};
DaysFrostRenderer.prototype.refresh = function(params) {
  this.value = params.value;
  this.eGui.innerHTML = '';
  this.updateImages();
};

class PhishGrid extends React.Component{
  
    constructor(props) {
      super(props);
      this.state = {
        row_width : 400,
        grid_height : 2000,
        gridApi:null,
        selected_url:true,
        selected_hash:true,
        selected_date:true,
        selected_time:true,
        selected_scores:true,
        selected_image:true,
        rowData:props.rowData
        }
      this.onGridReady = this.onGridReady.bind(this)

      this.state.columnDefs = [{
        headerName: "Info",
            suppressSizeToFit: false,
            children: [
          {
              headerName: "URL", field: "url", sortable: true,
              enableRowGroup: true,
              hide: false,
              filter: 'agTextColumnFilter',
              cellStyle: { 'white-space': 'normal', "word-break":"break-all"},
            }, {
              headerName: "Hash", field: "sha256", sortable: true,
              enableRowGroup: true,
              filter: 'agTextColumnFilter',
              cellStyle: { 'white-space': 'normal', "word-break":"break-all"},
            }],
          },
          {
            headerName: "Occurance",
            suppressSizeToFit: false,
            children: [
            {
              headerName: "Date", field: "dated", sortable: true,
              enableRowGroup: true,
              filter: 'agDateColumnFilter',
              cellStyle: { 'white-space': 'normal', "word-break":"break-all"},
              filterParams: {
                comparator: function(filterLocalDateAtMidnight, cellValue) {
                  var dateAsString = cellValue;
                  var dateParts = dateAsString.split('/');
                  var cellDate = new Date(
                    Number(dateParts[2]),
                    Number(dateParts[0]-1),
                    Number(dateParts[1])
                  );
                  if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                    return 0;
                  }
                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  }
                  if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  }
                },
              },
            },{
              headerName: "Time", field: "time", sortable: true,
              enableRowGroup: true,
              floatingFilter: false,
              cellStyle: { 'white-space': 'normal', "word-break":"break-all"},
              
            }
            ]
          }, 
          {
            headerName: "Scores",
            field: "scores",
            suppressSizeToFit: false,
            children: [
            {
              headerName: "Image Score", field: "Image Score", sortable: true, filter: true,
              enableRowGroup: true,
              filter: 'agNumberColumnFilter',
            },
            {
              headerName: "Hash Score", field: "Hash Score", sortable: true, filter: true,
              enableRowGroup: true,
              filter: 'agNumberColumnFilter',
            }]
          },
          {
            headerName: "Image",
            suppressSizeToFit: false,
            editable:false,
            copy:true,
            field: "image",
            floatingFilter: false,
            minWidth:this.state.row_width,
            cellRenderer: 'daysFrostRenderer',       // Component Cell Renderer
            cellRendererParams: {
                rendererImage: './milk.jpg'         // Complementing the Cell Renderer parameters
            }
          }]
  
        this.state.gridOptions={
          floatingFilter: true,
          enableFilter: true, //one of [true, false]
          quickFilterText: null,
          headerHeight:50,
          columnDefs: this.state.columnDefs,
          rowData: this.state.rowData,
          rowHeight: this.state.row_width*9/16,
          components: {
              daysFrostRenderer: DaysFrostRenderer
          },
          statusBar: {
            statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' }
            ]
          },
          defaultColDef: {
              editable: true,
              sortable: true,
              flex: 1,
              filter: true,
              resizable: true,
              floatingFilter: true
          }
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      
      this.state.gridOptions.getRowStyle = function(params) {
        if (params.node.rowIndex % 2 === 1) {
            return { background: '#F6FAFE' };
        }
    }
  }

  handleTableChange(data){
    alert(data)
    this.setState(
      {
        isLoaded: true,
        rowData: data
      }
    );
  } 

  onGridReady(params){
      this.state.gridApi = params.api;
      //global_width = window.innerWidth
      this.state.gridApi.refreshCells()
      this.state.gridColumnApi = params.columnApi;
    }

  componentWillReceiveProps(nextProps) {
    this.setState({ rowData: nextProps.rowData });  
  }
    
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if(this.state.gridApi != null){
      global_width = window.innerWidth
      this.state.gridApi.refreshCells({columns:["url"]});
    }
  }

    render(){
        return(
            <div
              className="ag-theme-alpine"
              style={{height:"100%",width:"95%", margin:"auto"}}
            >
              <ToggleButton
                value="check"
                selected={this.state.selected_url}
                onChange={() => {
                  this.state.gridColumnApi.setColumnVisible('url', !this.state.selected_url);
                  this.setState({
                    selected_url: !this.state.selected_url
                  });
                }}>
                <Typography>Url</Typography>
            </ToggleButton>

            <ToggleButton
                value="check"
                selected={this.state.selected_hash}
                onChange={() => {
                  this.state.gridColumnApi.setColumnVisible('sha256', !this.state.selected_hash);
                  this.setState({
                    selected_hash: !this.state.selected_hash
                  });
                }}>
                <Typography>Hash</Typography>
            </ToggleButton>

            <ToggleButton
                value="check"
                selected={this.state.selected_date}
                onChange={() => {
                  this.state.gridColumnApi.setColumnVisible('dated', !this.state.selected_date);
                  this.setState({
                    selected_date: !this.state.selected_date
                  });
                }}>
                <Typography>Date</Typography>
            </ToggleButton>

            <ToggleButton
                value="check"
                selected={this.state.selected_time}
                onChange={() => {
                  this.state.gridColumnApi.setColumnVisible('time', !this.state.selected_time);
                  this.setState({
                    selected_time: !this.state.selected_time
                  });
                }}>
                <Typography>Time</Typography>
            </ToggleButton>

            <ToggleButton
                value="check"
                selected={this.state.selected_scores}
                onChange={() => {
                  this.state.gridColumnApi.setColumnVisible('Image Score', !this.state.selected_scores);
                  this.state.gridColumnApi.setColumnVisible('Hash Score', !this.state.selected_scores);
                  this.setState({
                    selected_scores: !this.state.selected_scores
                  });
                }}>
                <Typography>Scores</Typography>
            </ToggleButton>

            <ToggleButton
                value="check"
                selected={this.state.selected_image}
                onChange={() => {
                  this.state.gridColumnApi.setColumnVisible('image', !this.state.selected_image);
                  this.setState({
                    selected_image: !this.state.selected_image
                  });
                }}>
                <Typography>Image</Typography>
            </ToggleButton>

                <AgGridReact
                gridOptions={this.state.gridOptions}
                rowSelection="multiple"
                onGridReady={this.onGridReady}
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                enableCellChangeFlash={true}
                processCellForClipboard={this.processCellForClipboard}>

            </AgGridReact>
            </div>
        );
    }
}

export default PhishGrid