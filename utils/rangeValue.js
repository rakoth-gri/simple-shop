// отображение RangeValue в DOM-elementе
export function rangeValue(range, rangeView) {
	range.oninput = () =>
		+range.value ? (rangeView.innerHTML = range.value.toLocaleString() + " &#8381;") : (rangeView.textContent = ``);
}
