import React from "react";

interface IUseSliderProps {
	list: Array<any>;
	defaultCountValue?: number;
}

export function useSlider({ list, defaultCountValue = 0 }: IUseSliderProps) {
	const sliderWrapperRef = React.useRef<HTMLDivElement | null>(null);
	const [widthSlider, setWidthSlider] = React.useState<number>(1);
	const [count, setCount] = React.useState<number>(defaultCountValue);

	React.useEffect(() => {
		if (sliderWrapperRef.current) {
			setWidthSlider(sliderWrapperRef.current.offsetWidth * list.length);
		}

		if (count < 0) setCount(list.length - 1);
		if (count >= list.length) setCount(0);
	}, [count, sliderWrapperRef, list]);

	return { setCount, sliderWrapperRef, count, widthSlider };
}