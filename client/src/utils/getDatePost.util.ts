function getDatePost(date: Date | string) {
	const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
		"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
	];

	const d = new Date(date);

	return `${monthNames[d.getMonth()]} ${d.getDate()}`;
}

export default getDatePost;