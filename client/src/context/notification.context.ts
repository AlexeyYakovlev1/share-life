import React from "react";

const NotificationContext = React.createContext({
	count: 0,
	setCount: (num: number | ((num: number) => number)) => { },
	likeIds: [-1],
	setLikeIds: (ids: Array<number> | ((ids: Array<number>) => Array<number>)) => { }
});

export default NotificationContext;