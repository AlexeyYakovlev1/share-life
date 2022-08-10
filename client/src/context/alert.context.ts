import React from "react";

const AlertContext = React.createContext({
	text: "",
	setText: (text: string | ((text: string) => string)) => { }
});

export default AlertContext;