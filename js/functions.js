document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("header-menu-icon");
  const sideMenu = document.getElementById("side-menu");

  menuIcon.addEventListener("click", function () {
    if (sideMenu.style.left === "0px" || !sideMenu.style.left) {
      sideMenu.style.left = "-550px";
    } else {
      sideMenu.style.left = "0px";
    }
  });

  sideMenu.addEventListener("click", function () {
    sideMenu.style.left = "-550px";
  });

});
let products = [

];

function initialize() {
  const ORDER_FORM = document.getElementById("order");
  ORDER_FORM.addEventListener("submit", addProduct);
  window.addEventListener("scroll", moveImagesWhenUserScrolls);
  showProducts();
}

function moveImagesWhenUserScrolls() {
  const scrollPosition = window.scrollY;
  const bee = document.getElementById("bee");
  if (bee) {
    const parallaxSpeedY = -0.5;
    const zigzagSpeedX = 100;
    const zigzagFrequency = 0.005;
    const zigzagX = Math.sin(scrollPosition * zigzagFrequency) * zigzagSpeedX;
    bee.style.transform = `translate(${zigzagX}px, ${scrollPosition * parallaxSpeedY}px)`;
  }
}


function addProduct(event) {
  event.preventDefault();

  const SEED = event.target.seed.value;
  const QUANTITY = event.target.quantity.value;
  const TYPE = event.target.type.value;
  const REHYDRATED = document.querySelector('input[name="rehydrated"]:checked') ? document.querySelector('input[name="rehydrated"]:checked').value : '';

  if (!SEED || !QUANTITY) {
    if (!SEED) {
      document.getElementById("seed-error").style.visibility = "visible";
    }
    if (!QUANTITY) {
      document.getElementById("quantity-error").style.visibility = "visible";
    }
    return;
  }

  products.push({
    seed: SEED,
    quantity: QUANTITY,
    type: TYPE,
    rehydrated: REHYDRATED
  });

  event.target.reset();
  document.getElementById("seed-error").style.visibility = "hidden";
  document.getElementById("quantity-error").style.visibility = "hidden";

  showProducts();
}

function showProducts() {
  const ORDER_LIST = document.getElementById("order-list");

  let allProducts = "";
  products.forEach((product, index) => {
    const rehydratedValue = product.rehydrated.trim().toLowerCase();
    const rehydratedText = product.rehydrated === 'yes' ? 'Sí' : 'No';
    allProducts += `
      <li>
        Semilla: ${product.seed}<br>
        Cantidad: ${product.quantity}<br>
        Variante/Color: ${product.type}<br>
        Rehidratada: ${product.rehydrated}<br>
        <button class="delete-button" onclick="deleteProduct(${index})">Eliminar</button>
      </li>`;
  });

  ORDER_LIST.innerHTML = allProducts;
  if (products.length > 0) {
    ORDER_LIST.classList.add('bordered');
  } else {
    ORDER_LIST.classList.remove('bordered');
  }
}

function deleteProduct(productId) {
  products.splice(productId, 1);
  showProducts();
}

initialize();