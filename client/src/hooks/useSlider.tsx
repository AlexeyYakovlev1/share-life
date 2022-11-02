import React from "react";
import { IPost, IPostPhoto } from "../models/post.models";
import { IPhoto } from "../utils/readerImages.util";

interface IUseSliderProps {
	list: Array<IPostPhoto> | Array<string> | Array<IPhoto> | Array<IPost>;
	defaultCountValue?: number;
}

export function useSlider({ list, defaultCountValue = 0 }: IUseSliderProps) {
	const sliderWrapperRef = React.useRef<HTMLDivElement | null>(null);
	const [widthSlider, setWidthSlider] = React.useState<number>(1);
	const [count, setCount] = React.useState<number>(defaultCountValue);
	const sliderOffsetWidth = sliderWrapperRef.current?.offsetWidth || 300;

	React.useEffect(() => {
		if (sliderWrapperRef.current) {
			setWidthSlider(sliderWrapperRef.current.offsetWidth * list.length);
		}

		if (count < 0) setCount(list.length - 1);
		if (count >= list.length) setCount(0);
	}, [count, sliderWrapperRef, list]);

	return { setCount, sliderWrapperRef, count, widthSlider, sliderOffsetWidth };
}