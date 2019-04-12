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
let total = 0;

const buy = elem => {
  let table = document.getElementById("tbl");
  const id = elem.dataset["productId"]; //instead elem.attributes[2].value

  const addNewToCart = () => {
    const product = products
      .map(item => ({ ...item, count: 1 }))
      .find(item => item.id == id);
    cart.push(product);
    cart.find(item => item.id == id).inStock--;
  };

  const handleIncrement = () => {
    if (checkStock()) {
      cart.find(item => item.id == id).count++;
      cart.find(item => item.id == id).inStock--;
      print();
    } else {
      alert(products.find(item => item.id == id).title + " Not in stock");
    }
  };

  const handleDecrement = () => {
    if (
      cart.find(item => item.id == id).inStock <
      products.find(item => item.id == id).inStock
    ) {
      cart.find(item => item.id == id).count--;
      cart.find(item => item.id == id).inStock++;
      print();
    }
  };

  const checkStock = () => {
    if (cart.find(item => item.id == id).inStock > 0) {
      return true;
    }
  };

  //check for new product
  let newProduct = cart.find(item => item.id == id);
  if (!newProduct) {
    addNewToCart();
    print();
  } else {
    handleIncrement();
  }

  //add cart items to table
  function print() {
    //execute total price
    const executeTotal = () => {
      let total = cart.reduce(
        (preValue, curValue) => preValue + curValue.price * curValue.count,
        0
      );
      document.getElementById("sum").innerHTML = total;
    };
    executeTotal();

    for (let i = table.childNodes.length - 1; i > 1; i--) {
      table.removeChild(table.childNodes[i]);
    }
    cart.forEach(element => {
      let tr = document.createElement("tr");

      tr.addEventListener("mouseover", function() {
        this.style.backgroundColor = "yellow";
      });

      tr.addEventListener("mouseout", function() {
        this.style.backgroundColor = "white";
      });

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
      let preValue = countNumber.value;
      countNumber.onchange = function() {
        let curValue = countNumber.value;
        console.log(element.inStock);
        if (curValue > preValue) {
          if (element.inStock > 0) {
            handleIncrement();
          } else {
            countNumber.value = preValue;
            alert(element.title + " not in stock");
          }
        } else {
          if (countNumber.value >= 0) {
            handleDecrement();
          } else {
            countNumber.value = preValue;
          }
        }
      };
      countCell.appendChild(countNumber);

      let deleteCell = document.createElement("td");
      const deleteLink = document.createElement("a");
      deleteLink.innerHTML = "Delete";
      deleteLink.href = "#";
      deleteLink.onclick = () => {
        cart = cart.filter(item => item.id != element.id);
        print();
      };
      deleteCell.appendChild(deleteLink);

      tr.appendChild(titleCell);
      tr.appendChild(priceCell);
      tr.appendChild(countCell);
      tr.appendChild(deleteCell);

      table.appendChild(tr);
    });
  }
};
