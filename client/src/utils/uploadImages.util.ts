function uploadImages(
	event: any,
	setSelectedImages: React.Dispatch<React.SetStateAction<any[]>>,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	if (!event.target?.files.length) return;

	const imageTypeRegex = /image\/(png|jpg|jpeg|gif)/gm;
	const files = Array.from(event.target?.files);
	const validImages: any = [];

	for (let i = 0; i < files.length; i++) {
		const file: any = files[i];

		if (file.type.match(imageTypeRegex)) {
			validImages.push(file);
		}
	}

	if (validImages.length) {
		setSelectedImages(validImages);
		return;
	}

	setText("Selected images are not of valid type!");
}

export default uploadImages;