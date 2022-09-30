import { productList } from "../constant/constants.js";

import { getLS, putLS } from "../utils/ls.js";

class Product {
	constructor(productList) {
		this.goods = "chosenGoods";
		this.$root = document.querySelector(".root");
		this.data = productList;
		this.render(this.data);
	}

	render(data) {
		let selectedGoods = getLS(this.goods);

		// получаем id из объекта location --> search --> вытаскиваем ID при помощи RegExp
		let id = location.search.replace(/[a-z\?=]+/, "");

		const { model, pict, desc1, desc2, store, price } = data[id];

		let temp = `
        <div class="description">
            <span class="model"> ${model}</span>
            <div class="store"> На складе: <span>${selectedGoods[id] ? selectedGoods[id] : store} </span> шт. </div>
            <div class="price"> Цена с НДС: <span>${price.toLocaleString()}</span> &#8381; </div>
            <img alt="picture" src="${pict}" class="pict">           
            <p class="desc">${desc1} </p>
            <p class="desc">${desc2} </p>
            <h2 class="title"> Основные возможности </h2>            
        </div>        
        `;

		this.$root.insertAdjacentHTML("beforeend", temp);

		this.description(data[id], document.querySelector(".description"));
	}

	description(data, description) {
		let desc1 = data.specification
			.split(";")
			.map((item) => `<p class="specification"> ${item};</p>`)
			.join("");

		description.insertAdjacentHTML("beforeend", desc1);

		if (data.specification2) {
			description.insertAdjacentHTML("beforeend", `<h2 class="title"> Другие характеристики </h2>`);

			let desc2 = data.specification2
				.split(";")
				.map((item) => `<p class="specification"> ${item};</p>`)
				.join("");

			description.insertAdjacentHTML("beforeend", desc2);
		}
	}
}

new Product(productList);
