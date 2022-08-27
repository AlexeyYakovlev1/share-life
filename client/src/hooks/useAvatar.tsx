const { REACT_APP_PUBLIC_PATH } = process.env;

function useAvatar(avatar: string) {
	if ((!avatar || avatar === "null")) {
		return `${REACT_APP_PUBLIC_PATH}/default-user-avatar.jpg`;
	}

	return avatar;
}

export default useAvatar;