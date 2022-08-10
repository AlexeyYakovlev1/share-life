import React from "react";

const LoaderContext = React.createContext({
	load: false,
	setLoad: (load: boolean | ((load: boolean) => boolean)) => { }
});

export default LoaderContext;