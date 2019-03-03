import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Header extends Component{
    constructor(props) {
        super(props);    
        this.inputRef = React.createRef();
      }

    changeTitle = (e) => {
    console.dir(e.target.innerText)
    }
    
    render(){
        return(
            <header className="header">
                <div className="header__logo-box">
                    <img src="../assets/image/Iconka-Cat-Commerce-Review.ico" alt="logo" className="header__logo" />
                </div>
                <div className="header__item">
                    <div 
                        className="header__name"
                        contentEditable="true" title="Rename file"
                        ref={this.inputRef}
                        onInput={this.changeTitle}
                        >
                            Untitled
                    </div>
                    <span className="header__save">
                        Save
                    </span>
                </div>

                <div 
                    className="header__button"                    
                    title="Create new file">
                    <Link className="header__link" to="/">
                        +
                    </Link>
                </div>

                {/* <nav className="header__nav">
                    <ul className="header__list">
                        <li className="header__item">
                            <Link className="header__link" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="header__item">
                            <Link className="header__link" to="/auth">
                                Auth
                            </Link>
                        </li>
                    </ul>
                </nav> */}
            </header>
        )
    }
}