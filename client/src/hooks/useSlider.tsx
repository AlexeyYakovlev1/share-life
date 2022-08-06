import React from "react";

export function useSlider({ list }: { list: Array<any> }) {
	const sliderWrapperRef = React.useRef<HTMLDivElement | null>(null);
	const [widthSlider, setWidthSlider] = React.useState<number>(1);
	const [count, setCount] = React.useState<number>(0);

	React.useEffect(() => {
		if (sliderWrapperRef.current) {
			setWidthSlider(sliderWrapperRef.current.offsetWidth * list.length);
		}

		if (count < 0) setCount(list.length - 1);
		if (count >= list.length) setCount(0);
	}, [count, sliderWrapperRef]);

	return { setCount, sliderWrapperRef, count, widthSlider };
}