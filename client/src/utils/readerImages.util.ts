export interface IPhoto {
	id: number;
	img: string;
}

function readerImages(
	selectedImages: any, // React.Dispatch<React.SetStateAction<any[]>> but this not work for "forEach"
	setPhotos: React.Dispatch<React.SetStateAction<any[]>>,
	setText: React.Dispatch<React.SetStateAction<string>>,
	filename = false
) {
	const resultPhotos: Array<IPhoto> = [];
	const fileReaders: any = [];
	let isCancel = false;

	if (selectedImages.length) {
		selectedImages.forEach((file: any, index: number) => {
			const reader: any = new FileReader();

			reader.readAsDataURL(file);
			fileReaders.push(reader);

			reader.onload = () => {
				const result = reader.result;
				let obj: any = {
					id: index + 1,
					img: result
				};

				if (filename) {
					obj = {
						base64: result,
						filename: file.name
					};
				}

				resultPhotos.push(obj);

				if (resultPhotos.length === selectedImages.length && !isCancel) {
					setPhotos(resultPhotos);
				}
			};

			reader.onerror = () => {
				setText(reader.error.message);
			};
		});
	}

	return () => {
		isCancel = true;
		fileReaders.forEach((fileReader: any) => {
			if (fileReader.readyState === 1) {
				fileReader.abort();
			}
		});
	};
}

export default readerImages;