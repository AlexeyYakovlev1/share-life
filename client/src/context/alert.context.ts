import React from "react";

const AlertContext = React.createContext({
	text: "",
	setText: (text: string | ((active: string) => string)) => { }
});

export default AlertContext;