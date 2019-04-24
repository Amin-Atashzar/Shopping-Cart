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
window.onload = () => {
  showProducts();
};

const showProducts = () => {
  products.forEach(product => {
    const element = `<figure class="shadow" onclick="buy(this)" data-product-id="${
      product.id
    }">
      <img src="g.jpg" alt="Picture not available!!" />
      <figcaption>
        <p>${product.title}</p>
        
        <p><span>Price :</span>${product.price}</p>
        
        <p><span>inStock :</span>${product.inStock}</p>
        <p class="red" id="${product.id}"></p>
      </figcaption>
    </figure>`;
    document.getElementById("root").innerHTML += element;
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
  checkStock(product, cart);
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
  checkStock(product, cart);
};

const checkStock = (product, cart) => {
  if (
    Number(cart.find(c => c.id === product.id).count) + 1 ===
    product.inStock
  ) {
    console.log("a");
    document.getElementById(`${product.id}`).innerHTML = "inStock is 1";
  } else {
    document.getElementById(`${product.id}`).innerHTML = "";
  }
};

const print = () => {
  const table = document.getElementById("tbl");
  document.getElementById("sum").innerHTML = getTotal(cart);

  for (let i = table.childNodes.length - 1; i > 1; i--) {
    table.removeChild(table.childNodes[i]);
  }
  cart.forEach(element => {
    let tr = document.createElement("tr");

    let titleCell = document.createElement("td");
    const titleNode = document.createTextNode(element.title);
    titleCell.appendChild(titleNode);

    let priceCell = document.createElement("td");
    const priceNode = document.createTextNode(element.price * element.count);
    priceCell.appendChild(priceNode);

    let countCell = document.createElement("td");
    const countNumber = document.createElement("input");
    countNumber.type = "number";
    countNumber.value = element.count;
    countNumber.onchange = function() {
      let curValue = countNumber.value;
      let product = products.find(
        item =>
          item.title === this.parentNode.parentNode.childNodes[0].innerHTML
      );
      handleInput(curValue, countNumber, product);
    };

    countCell.appendChild(countNumber);

    let deleteCell = document.createElement("td");
    const deleteLink = document.createElement("a");
    deleteLink.innerHTML = "Delete";
    deleteLink.href = "#";
    deleteLink.onclick = () => {
      handleDelete(element.id);
    };
    deleteCell.appendChild(deleteLink);

    tr.appendChild(titleCell);
    tr.appendChild(priceCell);
    tr.appendChild(countCell);
    tr.appendChild(deleteCell);

    table.appendChild(tr);
  });
};

const buy = elem => {
  const id = Number(elem.dataset["productId"]); //instead elem.attributes[2].value
  const draftCart = cart.map(item => ({ ...item }));
  addToCart(products.find(p => p.id === id), draftCart);
  if (validateCart(draftCart, products)) {
    cart = draftCart;
    print();
  } else {
    alert("action not valid");
  }
};
