import followUserFetch from "../../http/user/followUser.http";
import socket from "socket.io-client";
import React from "react";
import checkFollow from "../../http/follow/checkFollow.http";

const { REACT_APP_API_URL } = process.env;

export function useFollow(
	userId: number,
	setText: (text: string | ((text: string) => string)) => void,
	setFollowUser: React.Dispatch<React.SetStateAction<boolean>>
) {
	function followClick() {
		if (!userId) return;

		followUserFetch(userId.toString())
			.then((data) => {
				const { success, message, error } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				const io: any = socket;
				const socketConnect = io.connect(REACT_APP_API_URL);

				socketConnect.on("follow", (data: any) => setFollowUser(!data));
			});
	}

	React.useEffect(() => {
		checkFollow(+userId)
			.then((data) => {
				const { success } = data;

				if (!success) return;

				setFollowUser(data.follow);
			});
	}, [userId]);

	return { followClick };
}