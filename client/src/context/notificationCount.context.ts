import React from "react";

const NotificationCount = React.createContext({
	count: 0,
	setCount: (num: number | ((num: number) => number)) => { }
});

export default NotificationCount;