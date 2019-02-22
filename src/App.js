import React, { Component } from 'react';
import './style/index.scss';

import update from 'immutability-helper';


// import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';

import {store} from './store.js'

import MathTable from './components/mathtable'


import Cell from './containers/cell'


// let TableContainer = (rows, cols) =>{    
//     for (var row in rows){
//       for (var col in cols){
//         if (row == 0 || col == 0)
//           return <div key={col+row} x={row} y={col} contentEditable='true' value={null} formula={null}/>
//         else return <div key={col+row} x={row} y={col} contentEditable='false' value={null} formula={null}/>
//   }







store.subscribe(() => console.log("store", store.getState()))

let App = () =>
<Provider store = {store}>  
  <div className="App">  
    
    <MathTable />
  </div>
</Provider>

// class App extends Component {

//   cellRange = ( colStart, colEnd, rowStart, rowEnd) => {
//       let arrayOfRows = []    
//       for ( let x = rowStart; x <= rowEnd; x++ ){
//           let arrayOfCells = []
//           for (let y = colStart.charCodeAt(0); y <= colEnd.charCodeAt(0); y++){
//               let interCell = {}
//               if (x == 0 || y == 64){
//                   Object.assign(interCell, {key: String.fromCharCode(y) + x, x: x, y: String.fromCharCode(y), 
//                       contentEditable: false, value: '', formula: ''})
//               } else Object.assign(interCell, {key: String.fromCharCode(y) + x, x: x, y: String.fromCharCode(y), value: '', formula: ''});   
//               arrayOfCells.push(interCell)
//           }
//           arrayOfRows.push(arrayOfCells)
//       }
//       console.log(arrayOfRows)
//       return arrayOfRows
//   }


//   render(){
//       let tableStyle = {
//         align:"center"
//       };
//       let data = this.cellRange("@", "D", 0, 5) 
//       let list = data.map((item)=> {
//             console.log(item)
//               return (
//                   <tr>
//                       {item.map(cell => {
//                         console.log("cell", cell)
//                           return (
//                               <Cell cellFromState={cell} key={cell.id} />
//                           )
//                       })}
//                   </tr>
//               )
//           }        
//       )
//       return (
//         <Provider store = {store}> 
       
//              <div >
//                   <table cellSpacing="3" id="mytable" style={tableStyle}>
//                        <tbody>{list}</tbody>
//                   </table>

//              </div>


//         </Provider>       
//        )
//   } 
// }

export default App;
