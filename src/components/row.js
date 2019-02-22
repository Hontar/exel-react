import React, { Component } from 'react';

import Cell from '../containers/cell'


class Row extends Component {

    cellRange = ( colStart, colEnd, rowStart, rowEnd) => {
        let arrayOfRows = []    
        for ( let x = rowStart; x <= rowEnd; x++ ){
            let arrayOfCells = []
            for (let y = colStart.charCodeAt(0); y <= colEnd.charCodeAt(0); y++){
                let interCell = {}
                if (x == 0 || y == 64){
                    Object.assign(interCell, {key: String.fromCharCode(y) + x, x: x, y: String.fromCharCode(y), 
                        contentEditable: false, value: '', formula: ''})
                } else Object.assign(interCell, {key: String.fromCharCode(y) + x, x: x, y: String.fromCharCode(y), value: '', formula: ''});   
                arrayOfCells.push(interCell)
            }
            arrayOfRows.push(arrayOfCells)
        }
        console.log(arrayOfRows)
        return arrayOfRows
    }


    render(){
        let data = this.cellRange("@", "D", 0, 5)                
            data.map((item)=> {
                return (
                    <tr>
                        {item.map(cell => {
                            return (
                                <Cell cellFromState={cell} />
                            )
                        })}
                    </tr>
                )
            }        
        )        
    }
} 

