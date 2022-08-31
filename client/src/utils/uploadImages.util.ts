function uploadImages(
	event: any,
	setLoad: React.Dispatch<React.SetStateAction<boolean>>,
	setSelectedImages: React.Dispatch<React.SetStateAction<any[]>>,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	const imageTypeRegex = /image\/(png|jpg|jpeg|gif)/gm;

	setLoad(true);
	if (!event.target?.files.length) {
		setLoad(false);
		return;
	}

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
		setLoad(false);
		return;
	}

	setText("Selected images are not of valid type!");
	setLoad(false);
}

export default uploadImages;