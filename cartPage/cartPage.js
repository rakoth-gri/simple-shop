import { productList } from "../constant/constants.js";

import { getLS, putLS } from "../utils/ls.js";

import { cartTable, emptyCart } from "../constant/constants.js";

class Cart {
	constructor() {
		this.storage = "storage";
		this.$root = document.querySelector(".root");
		this.goods = "chosenGoods";
	}

	render(data) {
		let storage = getLS(this.storage),
			selectedGoods = getLS(this.goods);

		if (!Object.keys(storage).length) {
			this.$root.innerHTML = `<h1 style="text-align: center; color:red;"> ${emptyCart} </h1>`;
			return;
		}

		const head = `        
            <tr>            
                ${cartTable.tHead
					.map(({ style, value }) => `<th class="${style}"> ${value} </th>`)
					.join("")}                
            </tr> `;

		let tableData = "";

		for (let key in storage) {
			const { model, price } = data[key];

			tableData += `
                <tr>                    
                    <td class="model">${model} </td>
                    <td class="price"><span>${price.toLocaleString()}</span> &#8381; </td>
                    <td class="store">${storage[key]}</td>
                    <td class="summ"><span> ${(price * storage[key]).toLocaleString()} </span> &#8381; </td>
                    <td> <button class="btnDel" data-del="${key}"> удалить </button> </td>
                </tr>`;
		}

		// рендеринг таблицы
		this.$root.innerHTML = `<table class="table">
        ${head}
		${tableData}
            <tr> 
                <td colspan="4"> Сумма: </td> 
                <td class='invoice'></td> 
            <tr>
        </table>`;

		let invoice = document.querySelector(".invoice"),
			btnDel = document.querySelectorAll(".btnDel"),
			summ = document.querySelectorAll(".summ span");

		invoice.textContent = [...summ].map((i) => +i.innerText.replace(/\D/g, "")).reduce((acc, i) => acc + i, 0);

		// метод удаления товара
		this.delProduct(btnDel, storage, selectedGoods);
	}

	delProduct(btns, storage, selectedGoods) {
		// let storage = getLS(this.storage);

		btns.forEach((btn) =>
			btn.addEventListener("click", () => {
				delete storage[btn.dataset.del];
				delete selectedGoods[btn.dataset.del];
				putLS([
					{ key: this.storage, data: storage },
					{ key: this.goods, data: selectedGoods },
				]);
				this.render(productList);
			})
		);
	}
}

new Cart().render(productList);
