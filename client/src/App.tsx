import React from "react";
import useRoutes from "./hooks/useRoutes";

function App() {
	const routes = useRoutes();

	return (
		<React.Fragment>
			{routes}
		</React.Fragment>
	);
}

export default App;
