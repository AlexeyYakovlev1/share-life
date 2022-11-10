import React from "react";
import checkLike from "../http/posts/checkLike.http";
import { IPost } from "../models/post.models";
import socket from "socket.io-client";
import putLike from "../http/posts/putLike.http";
import { IPerson } from "../models/person.models";
import AlertContext from "../context/alert.context";

export interface IPutedLike {
	puted: boolean;
	submit: boolean;
}

const { REACT_APP_API_URL } = process.env;

function useLike(
	info: IPost,
	currentUser: IPerson
) {
	const [likesNum, setLikesNum] = React.useState<number>(info.person_id_likes.length);
	const [putedLike, setPutedLike] = React.useState<{ puted: boolean, submit: boolean }>({
		puted: info.person_id_likes.includes(+currentUser.id),
		submit: false
	});
	const { setText } = React.useContext(AlertContext);

	// puted like
	React.useEffect(() => {
		if (currentUser.id === -1) return;

		checkLike(+info.id)
			.then((data) => {
				const { success, result } = data;

				if (!success) return;

				setPutedLike({ ...putedLike, puted: result });
			});
		setLikesNum(info.person_id_likes.length);
	}, [info]);

	React.useEffect(() => {
		if (!putedLike.submit) return;

		const io: any = socket;
		const socketConnect = io.connect(REACT_APP_API_URL);

		socketConnect.on("likePost", (data: any) => {
			setPutedLike({ puted: !data, submit: false });
		});
	}, [putedLike]);

	// нажимаем на кнопку лайка
	function likeClick() {
		putLike(+info.id)
			.then((data) => {
				const { success, error, message, likesNum: numsFromServer } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setPutedLike({ ...putedLike, submit: true });
				setLikesNum(numsFromServer);
			});
	}

	return {
		likeClick,
		likesNum, setLikesNum,
		putedLike, setPutedLike
	};
}

export default useLike;