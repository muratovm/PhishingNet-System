import React, { Component } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import axios from "axios";
import $ from 'jquery';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

let global_width = 400;

export const API_URL = "http://192.168.2.12:8000/api/encounters";

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

function PersonFilter() {
}

PersonFilter.prototype.init = function(params) {
    this.valueGetter = params.valueGetter;
    this.filterText = null;
    this.setupGui(params);
};

// not called by ag-Grid, just for us to help setup
PersonFilter.prototype.setupGui = function(params) {
    this.gui = document.createElement('div');
    $(this.gui.innerHTML) 

    this.eFilterText = this.gui.querySelector('#filterText');
    this.eFilterText.addEventListener("changed", listener);
    this.eFilterText.addEventListener("paste", listener);
    this.eFilterText.addEventListener("input", listener);
    // IE doesn't fire changed for special keys (eg delete, backspace), so need to
    // listen for this further ones
    this.eFilterText.addEventListener("keydown", listener);
    this.eFilterText.addEventListener("keyup", listener);

    var that = this;

    function listener(event) {
        that.filterText = event.target.value;
        params.filterChangedCallback();
    }
};

PersonFilter.prototype.getGui = function() {
    return this.gui;
};

PersonFilter.prototype.doesFilterPass = function(params) {
    // make sure each word passes separately, ie search for firstname, lastname
    var passed = true;
    var valueGetter = this.valueGetter;

    this.filterText.toLowerCase().split(' ').forEach(function(filterWord) {
        var value = valueGetter(params);

        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
            passed = false;
        }
    });

    return passed;
};

PersonFilter.prototype.isFilterActive = function() {
    return this.filterText != null && this.filterText !== '';
};

PersonFilter.prototype.getModel = function() {
    return { value: this.filterText.value };
};

PersonFilter.prototype.setModel = function(model) {
    this.eFilterText.value = model.value;
};



class App extends Component {

  
processCellForClipboard = params => {
  return params.value;
};

  constructor(props) {
    super(props);
    this.onGridReady = this.onGridReady.bind(this)
    this.state = {
      row_width : 400,
      grid_height : 2000,
      width:null,
      height:null,
      gridApi:null
    }
    this.state.columnDefs = [{
      headerName: "Info",
          suppressSizeToFit: false,
          children: [
        {
            headerName: "URL", field: "url", sortable: true,
            enableRowGroup: true,
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
            floatingFilter: true,
            filter: PersonFilter ,
          }
          ]
        }, 
        {
          headerName: "Scores",
          suppressSizeToFit: false,
          children: [
          {
            headerName: "Image Score", field: "Image Score", sortable: true, filter: true,
            filter: 'agNumberColumnFilter',
          },
          {
            headerName: "Hash Score", field: "Hash Score", sortable: true, filter: true,
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
        rowData: null,
        rowHeight: this.state.row_width*9/16,
        components: {
            daysFrostRenderer: DaysFrostRenderer,
            timefilter: PersonFilter
        },
        statusBar: {
          statusPanels: [
              { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' }
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

  
updateWindowDimensions() {
  this.setState({ width: window.innerWidth, height: window.innerHeight });
  if(this.state.gridApi != null){
    global_width = window.innerWidth
    this.state.gridApi.refreshCells({columns:["url"]});
  }
}

  componentDidMount() {
    this.updateWindowDimensions();
    axios.get(API_URL).then(res =>{
      //var obj = JSON.parse(res.data[0]);
      for(var i=0; i<res.data.length; i++){
        for(var j=0; j<res.data[i].scores.length; j++){
          let type = res.data[i].scores[j].type
          let score = res.data[i].scores[j].score
          res.data[i][type] = score
        }
        delete res.data[i].scores
      }
      
      this.setState({
        isLoaded: true,
        rowData: res.data
      });
    })
    //window.addEventListener('resize', this.updateWindowDimensions);
    
    /*
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json')
    .then(result => result.json())
    .then(rowData => this.setState({rowData}))
    }

    this.onButtonClick = e => {
      
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map( node => node.data )
      const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
      
    }
    */
  }

  componentWillUnmount() {
    //window.removeEventListener('resize', this.updateWindowDimensions);
  }

  onGridReady(params){
    this.state.gridApi = params.api;
    //global_width = window.innerWidth
    this.state.gridApi.refreshCells()
  }

  render() {
    return (
      <div
        className="ag-theme-alpine"
        style={{height:1000,width:"100%", margin:"auto",maxWidth:1700}}
      >
      <AgGridReact
            style= {{padding:100}}
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


function resize(api){
  api.sizeColumnsToFit();
}


export default App;