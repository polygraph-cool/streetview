export function map(
	scrollY,
	el,
	startOutOpacity,
	endOutOpacity,
	startInOpacity,
	endInOpacity,
	fadeOut_OffsetTop,
	fadeOut_OffsetBottom,
	fadeIn_OffsetTop,
	fadeIn_OffsetBottom,
	scroll_OffsetTop,
	scroll_OffsetBottom
) {
	if (scrollY > fadeOut_OffsetTop && scrollY < fadeOut_OffsetBottom) {
		el.style.opacity =
			endOutOpacity -
			(1 - getPercentScrolled(scrollY, fadeOut_OffsetTop, fadeOut_OffsetBottom)) *
				(endOutOpacity - startOutOpacity);
	} else if (
		scrollY > fadeOut_OffsetBottom ||
		(startInOpacity == endOutOpacity && scrollY < fadeIn_OffsetTop)
	) {
		el.style.opacity = endOutOpacity;
	} else if (scrollY < fadeOut_OffsetBottom && scrollY > fadeIn_OffsetBottom) {
		el.style.opacity = startOutOpacity;
	}
}

export function random(min, max) {
	return Math.random() * (max - min) + min;
}

export function constrain(n, low, high) {
	return Math.max(Math.min(n, high), low);
}

export function getPercentScrolled(scrollY, scroll_OffsetTop, scroll_OffsetBottom) {
	let offset = scrollY - scroll_OffsetTop;
	offset = constrain(offset, 0, scroll_OffsetBottom - scroll_OffsetTop);

	let percentScrolled = offset / (scroll_OffsetBottom - scroll_OffsetTop);
	percentScrolled = constrain(percentScrolled, 0, 1);
	return percentScrolled;
}

export function toParas(text) {
	let paras = text.trim().split(/\n+/g);
	return paras;
}
