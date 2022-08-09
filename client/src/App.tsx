import React from "react";
import AlertContext from "./context/alert.context";
import LoaderContext from "./context/loader.context";
import useRoutes from "./hooks/useRoutes";

function App() {
	const routes = useRoutes();
	const [load, setLoad] = React.useState<boolean>(false);
	const [text, setText] = React.useState<string>("");

	return (
		<LoaderContext.Provider value={{ load, setLoad }}>
			<AlertContext.Provider value={{ text, setText }}>
				{routes}
			</AlertContext.Provider>
		</LoaderContext.Provider>
	);
}

export default App;
