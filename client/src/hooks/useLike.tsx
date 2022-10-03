import React from "react";
import checkLike from "../http/posts/checkLike.http";
import { IPost } from "../models/post.models";
import socket from "socket.io-client";
import putLike from "../http/posts/putLike.http";
import { IPerson } from "../models/person.models";

export interface IPutedLike {
	puted: boolean;
	submit: boolean;
}

const { REACT_APP_API_URL } = process.env;

function useLike(
	info: IPost,
	setText: (text: string | ((text: string) => string)) => void,
	currentUser: IPerson
) {
	const [likesNum, setLikesNum] = React.useState<number>(info.person_id_likes.length);
	const [putedLike, setPutedLike] = React.useState<{ puted: boolean, submit: boolean }>({
		puted: info.person_id_likes.includes(+currentUser.id),
		submit: false
	});

	// puted like
	React.useEffect(() => {
		checkLike(+info.id)
			.then((data) => {
				const { success, result, error, message } = data;

				if (!success) {
					setText(message || error);
					return;
				}

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
				const { success, error, message, likesNum } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setLikesNum(likesNum);
				setPutedLike({ ...putedLike, submit: true });
			});
	}

	return {
		likeClick,
		likesNum, setLikesNum,
		putedLike, setPutedLike
	};
}

export default useLike;