// достает из LS
export const getLS = (key) => JSON.parse(localStorage.getItem(key) || "{}");

// помещает в LS
export const putLS = (array) => array.forEach(({ key, data }) => localStorage.setItem(key, JSON.stringify(data)));