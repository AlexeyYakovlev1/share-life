import React from "react";

const LoaderContext = React.createContext({
	load: false,
	setLoad: (load: boolean | ((active: boolean) => boolean)) => { }
});

export default LoaderContext;