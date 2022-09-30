// ************ APPLICATION на ES6 - КЛАССЫ ******************
import { productList, cart, AddedProds, range, rangeView, root, form, select } from "../constant/constants.js";

// функция фильтра
import { filter } from "../utils/filter.js";

// утилита
import { rangeValue } from "./../utils/rangeValue.js";

// работа с LS
import { getLS, putLS } from "./../utils/ls.js";

// функция вывода значения range
rangeValue(range, rangeView);

class Main {
	constructor() {
		this.storage = "storage";
		this.cart = "cart-active";
		this.goods = "chosenGoods";
	}

	setInLS(id, ind, amount, store) {
		// используем локальное хранилище
		let storage = getLS(this.storage),
			selectedGoods = getLS(this.goods);

		storage[id] = (storage[id] || 0) + 1;

		cart.classList.add(this.cart);

		amount[ind].textContent = storage[id];

		store[ind].textContent = productList[id].store - storage[id];

		selectedGoods[id] = +store[ind].innerText;

		AddedProds.textContent = Object.values(storage).reduce((acc, i) => acc + i, 0);

		putLS([
			{ key: this.storage, data: storage },
			{ key: this.goods, data: selectedGoods },
		]);
	}

	deleteFromLS(id, ind, amount, store) {
		let storage = getLS(this.storage),
			selectedGoods = getLS(this.goods);

		if (storage[id] > 1) {
			storage[id]--;
			amount[ind].textContent = storage[id];
		} else {
			delete storage[id];
			amount[ind].textContent = 0;
		}

		store[ind].textContent = productList[id].store - amount[ind].textContent;

		selectedGoods[id] = +store[ind].textContent;

		// общее количество товаров в корзине!
		AddedProds.textContent = Object.values(storage).reduce((acc, i) => acc + i, 0);

		if (Object.values(storage).length) cart.classList.remove(this.cart);

		putLS([
			{ key: this.storage, data: storage },
			{ key: this.goods, data: selectedGoods },
		]);
	}

	render(data) {
		let storage = getLS(this.storage),
			selectedGoods = getLS(this.goods);

		// сохранение активного класса корзины при перезагрузке
		Object.values(storage).length && cart.classList.add(this.cart);

		// сохранение товаров в корзине при перезагрузке
		AddedProds.textContent = Object.values(storage).reduce((acc, i) => acc + i, 0);

		// очищаем root для каталога товаров
		root.innerHTML = "";

		for (let key in data) {
			let { model, pict, rating, price, store } = data[key];

			let card = `
            <div class="card">
                <span class="model"> ${model}</span>
                <a href="./product/product.html?id=${key}" alt="good-link"  ><img class="pict" src="${pict}" data-id="${key}"></img></a>
                <span class="rating"> ${rating} </span>                
                <div class="settings">
                    <div class="price"> <span class="price__span">${price.toLocaleString()}</span> &#8381; </div>
                    <div class="controll"> 
                        <span class="plus" data-id="${key}"> + </span>
                        <span class="amount"> ${storage[key] ? storage[key] : 0} </span>  
                        <span class="minus" data-id="${key}"> - </span>  
                    </div>                
                </div>
                <div class="store"> В наличии: 
                    <span> 
                        ${selectedGoods[key] ? selectedGoods[key] : store} 
                    </span> 
                </div>                
            </div>`;
			root.insertAdjacentHTML("beforeend", card);
		}

		// DOM-elements-constants
		const plus = document.querySelectorAll(".plus"),
			minus = document.querySelectorAll(".minus"),
			amount = document.querySelectorAll(".amount"),
			store = document.querySelectorAll(".store span"),
			pict = document.querySelectorAll(".pict");

		// прибавляем продукт
		this.plusEvent(plus, store, amount);

		// удаляем продукт
		this.minusEvent(minus, store, amount);
	}

	plusEvent(plus, store, amount) {
		plus.forEach((el, ind) => {
			el.addEventListener("click", () => this.setInLS(el.getAttribute("data-id"), ind, amount, store));
		});
	}

	minusEvent(minus, store, amount) {
		minus.forEach((el, ind) => {
			el.addEventListener("click", () => this.deleteFromLS(el.getAttribute("data-id"), ind, amount, store));
		});
	}
}

export const main = new Main();
main.render(productList);

// ************** Фильтр *******************

// создаем новый объект ******
function BuildDataObject(data) {
	return data.reduce((acc, i) => {
		acc[i[0]] = i[1];
		return acc;
	}, {});
}

form.addEventListener("submit", function (e) {
	e.preventDefault();

	// приводим к числам
	let selectedPrice = Number(range.value),
		category = select.value,
		data = null;

	// фильтр по категории товара
	switch (category) {
		case "":
			data = productList;
			break;
		default:
			// фильтр по категории оборудования
			data = BuildDataObject(Object.entries(productList).filter((i) => i[1].model.includes(category)));
			break;
	}

	// отсортированный массив данных
	const sortedData = filter(selectedPrice, data);

	// вызываем метод рендер
	main.render(BuildDataObject(sortedData));
});
