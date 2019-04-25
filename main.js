let cart = [];
const products = [
  {
    id: 1,
    title: "product 1",
    price: 100,
    inStock: 2
  },
  {
    id: 2,
    title: "product 2",
    price: 200,
    inStock: 3
  },
  {
    id: 3,
    title: "product 3",
    price: 300,
    inStock: 4
  },
  {
    id: 4,
    title: "product 4",
    price: 400,
    inStock: 5
  },
  {
    id: 5,
    title: "product 5",
    price: 500,
    inStock: 6
  }
];

const printProducts = () => {
  const root = document.getElementById("root");
  root.innerHTML = "";
  products
    .map(product => ({
      ...product,
      inStock:
        product.inStock -
        cart.filter(i => i.id === product.id).reduce((c, item) => item.count, 0)
    }))
    .filter(item => item.inStock > 0)
    .forEach(product => {
      const element = `
      <figure class='shadow' onclick="buy(this)" data-product-id='${
        product.id
      }'>
      <img src="g.jpg" alt="Picture not available!!" />
      <figcaption>
          <p>${product.title}</p>
          
          <p><span>Price :</span>${product.price}</p>
          
          <p><span>inStock :</span>${product.inStock}</p>
          <p class="red" id="${product.id}"></p>
      </figcaption>
      </figure>
      `;
      root.innerHTML += element;
    });
};

const addToCart = (product, cart) => {
  const productInCart = cart.find(item => item.id === product.id);
  if (productInCart) {
    productInCart.count++;
  } else {
    const cartItem = {
      ...product,
      count: 1
    };
    delete cartItem.inStock;
    cart.push(cartItem);
  }
};

const validateCart = (cart, products) =>
  cart.reduce((acc, item) => {
    if (item.count > products.find(p => p.id === item.id).inStock) {
      acc = false;
    }
    return acc;
  }, true);

const getTotal = cart =>
  cart.reduce(
    (preValue, curValue) => preValue + curValue.price * curValue.count,
    0
  );

const handleDelete = id => {
  cart = cart.filter(item => item.id != id);
  console.log("a");
  print();
  document.getElementById(`${id}`).innerHTML = "";
};

const handleInput = (curValue, countNumber, product) => {
  if (curValue < 0) {
    countNumber.value = 0;
    alert("invalid action!!");
  } else {
    const draftCart = cart.map(item => ({ ...item }));
    draftCart.find(item => item.id === product.id).count = countNumber.value;
    if (validateCart(draftCart, products)) {
      cart = draftCart;
      print();
    } else {
      countNumber.value = countNumber.value - 1;
      alert("invalid action");
    }
  }
};

const printInvoice = () => {
  const table = document.getElementById("tbl");
  document.getElementById("sum").innerHTML = getTotal(cart);

  for (let i = table.childNodes.length - 1; i > 1; i--) {
    table.removeChild(table.childNodes[i]);
  }
  cart.forEach(item => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${item.title}</td>
    <td>${item.price}</td>
    <td><input type='number' value='${
      item.count
    }' class='count' data-product-id = "${item.id}"/></td>
    <td><a href="#"  class="delete" data-product-id="${item.id}">Delete</a></td>
    `;
    table.appendChild(tr);
  });
};

const buy = elem => {
  const id = Number(elem.dataset["productId"]); //instead elem.attributes[2].value
  const draftCart = cart.map(item => ({ ...item }));
  addToCart(products.find(p => p.id === id), draftCart);
  if (validateCart(draftCart, products)) {
    cart = draftCart;
    printInvoice();
    printProducts();
  } else {
    alert("action not valid");
  }
};

const listenDelete = () => {
  document.addEventListener("click", e => {
    const element = e.target;
    if (element && element.classList.contains("delete")) {
      cart = cart.filter(
        item => item.id !== Number(element.dataset["productId"])
      );
      printInvoice();
      printProducts();
    }
  });
};

const updateCount = (id, cart, value) => {
  if (value > 0) {
    const productInCart = cart.find(item => item.id === id);
    productInCart.count = value;
  } else {
    cart.splice(cart.findIndex(item => item.id === id), 1);
  }
};

const listenInput = () => {
  document.addEventListener("change", e => {
    const element = e.target;
    if (element && element.classList.contains("count")) {
      const id = Number(element.dataset["productId"]);
      const draftCart = cart.map(item => ({ ...item }));
      const value = element.value;
      updateCount(id, draftCart, value);
      if (validateCart(draftCart, products)) {
        cart = draftCart;
        printProducts();
      } else {
        alert("product out of stock!");
      }
      printInvoice();
    }
  });
};

printProducts();
listenDelete();
listenInput();
