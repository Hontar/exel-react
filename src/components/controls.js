import React, { Component } from 'react';

export default ({ inputType, config }) => {
	let component = null;
	switch (inputType) {
		case "textarea": {
			component = (
				<textarea 
					// className={touch && valid ? "input-box__error" : "input-box__input"} 
					{...config} />
			);
			break;
		}
		case "select": {
			component = (
				<select 
					// className={touch && valid ? "input-box__error" : "input-box__input"} 
					{...config}>
					{config.option.map(el => (
						<option key={el.value} value={el.value}>
							{el.name}
						</option>
					))}
				</select>
			);
			break;
		}
		default:
			component = <input 
			// className={valid && touch ? "input-box__error" : "input-box__input"} 
			{...config} />;
	}

	return (
		<>
			{/* <label className="input-box__label">{label}</label> */}
			{component}
		</>
    )
}