function getDatePost(date: Date | string) {
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	const d = new Date(date);

	return `${monthNames[d.getMonth()]} ${d.getDate()}`;
}

export default getDatePost;