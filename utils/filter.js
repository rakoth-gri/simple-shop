import { desc, asc, ratingSort } from "../constant/constants.js";

// фильтр по цене
const Price = (data, selectedPrice) =>
	Object.entries(data).filter((i) => Math.round(i[1].price / 1000) === Math.round(selectedPrice / 1000));

const SortingController = {
	// сортировка по убыванию
	Desc: (data) => data.sort((a, b) => b[1].price - a[1].price),
	// сортировка по возрастанию
	Asc: (data) => data.sort((a, b) => a[1].price - b[1].price),
	// фильтр по рейтингу
	Rating: (data) => data.sort((a, b) => b[1].rating - a[1].rating),
};

// основной код фильтра
export const filter = (selectedPrice, data) => {
	let selectedPriceData = selectedPrice ? Price(data, selectedPrice) : Object.entries(data);

	switch (true) {
		case desc.checked:
			return SortingController.Desc(selectedPriceData);
		case asc.checked:
			return SortingController.Asc(selectedPriceData);
		case ratingSort.checked:
			return SortingController.Rating(selectedPriceData);
		default:
			return selectedPriceData;
	}
};
