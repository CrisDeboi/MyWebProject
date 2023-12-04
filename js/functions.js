document.addEventListener("DOMContentLoaded", function () {
  const MENU_ICON = document.getElementById("header-menu-icon");
  const SIDE_MENU = document.getElementById("side-menu");

  MENU_ICON.addEventListener("click", function () {
    if (SIDE_MENU.style.left === "0px" || !SIDE_MENU.style.left) {
      SIDE_MENU.style.left = "-550px";
    } else {
      SIDE_MENU.style.left = "0px";
    }
  });

  SIDE_MENU.addEventListener("click", function () {
    SIDE_MENU.style.left = "-550px";
  });

});
let PRODUCTS = [

];

function initialize() {
  const SAVED_PRODUCTS = localStorage.getItem("products");
  if (SAVED_PRODUCTS) {
    PRODUCTS = JSON.parse(SAVED_PRODUCTS);
  }
  
  const ORDER_FORM = document.getElementById("order");
  ORDER_FORM.addEventListener("submit", addProduct);
  window.addEventListener("scroll", moveImagesWhenUserScrolls);
  showProducts();
}

function moveImagesWhenUserScrolls() {
  const SCROLL_POSITION = window.scrollY;
  const BEE = document.getElementById("bee");
  if (BEE) {
    const PARALLAX_SPEED_Y = -0.5;
    const ZIGZAG_SPEED_X = 100;
    const ZIGZAG_FREQUENCY = 0.005;
    const ZIGZAG_X = Math.sin(SCROLL_POSITION * ZIGZAG_FREQUENCY) * ZIGZAG_SPEED_X;
    BEE.style.transform = `translate(${ZIGZAG_X}px, ${SCROLL_POSITION * PARALLAX_SPEED_Y}px)`;
  }
}


function addProduct(event) {
  event.preventDefault();

  const SEED = event.target.seed.value.trim();
  const QUANTITY = event.target.quantity.value.trim();
  const TYPE = event.target.type.value.trim();
  const REHYDRATED = document.querySelector('input[name="rehydrated"]:checked') ? document.querySelector('input[name="rehydrated"]:checked').value : '';

  updateErrorMessage("seed", SEED);
  updateErrorMessage("quantity", QUANTITY);
  updateErrorMessage("type", TYPE);
  updateErrorMessage("rehydrated", REHYDRATED);

  if (SEED && QUANTITY && TYPE && REHYDRATED) {
    PRODUCTS.push({
      seed: SEED,
      quantity: QUANTITY,
      type: TYPE,
      rehydrated: REHYDRATED
    });

    event.target.reset();
    updateLocalStorage();
    showProducts();
  }

}
function updateErrorMessage(fieldId, value) {
  const ERROR_MESSAGE = document.getElementById(`${fieldId}-error`);
  if (value) {
    ERROR_MESSAGE.style.visibility = "hidden";
  } else {
    ERROR_MESSAGE.style.visibility = "visible";
  }
}

function showProducts() {
  const ORDER_LIST = document.getElementById("order-list");

  let allProducts = "";
  PRODUCTS.forEach((product, index) => {
    const REHYDRATED_VALUE = product.rehydrated.trim().toLowerCase();
    const REHYDRATED_TEXT = product.rehydrated === 'yes' ? 'Sí' : 'No';
    allProducts += `
      <li>
        Semilla: ${product.seed}<br>
        Cantidad: ${product.quantity}<br>
        Variante/Color: ${product.type}<br>
        Rehidratada: ${product.rehydrated}<br>
        <button class="delete-button" onclick="deleteProduct(${index})">Eliminar</button>
        <button class="update-button" onclick="showEditForm(${index})">Modificar</button>
      </li>`;
  });

  ORDER_LIST.innerHTML = allProducts;
  if (PRODUCTS.length > 0) {
    ORDER_LIST.classList.add('bordered');
  } else {
    ORDER_LIST.classList.remove('bordered');
  }
}

function deleteProduct(productId) {
  PRODUCTS.splice(productId, 1);
  updateLocalStorage();
  showProducts();
}

function showEditForm(productId) {
  const PRODUCT = PRODUCTS[productId];

  document.getElementById("seed").value = PRODUCT.seed;
  document.getElementById("quantity").value = PRODUCT.quantity;
  document.getElementById("type").value = PRODUCT.type;
  if (PRODUCT.rehydrated === "yes") {
    document.getElementById("rehydratedYes").checked = true;
  } else {
    document.getElementById("rehydratedNo").checked = true;
  }


  const ORDER_FORM = document.getElementById("order");
  ORDER_FORM.removeEventListener("submit", addProduct);
  ORDER_FORM.onsubmit = function (event) {
    event.preventDefault();
    saveProductEdits(productId);
  };
}

function saveProductEdits(productId) {
  const EDITED_SEED = document.getElementById("seed").value;
  const EDITED_QUANTITY = document.getElementById("quantity").value;
  const EDITED_TYPE = document.getElementById("type").value;
  const EDITED_REHYDRATED = document.querySelector('input[name="rehydrated"]:checked').value;

  if (validateEditForm(EDITED_SEED, EDITED_QUANTITY, EDITED_TYPE, EDITED_REHYDRATED)) {
    PRODUCTS[productId] = {
      seed: EDITED_SEED,
      quantity: EDITED_QUANTITY,
      type: EDITED_TYPE,
      rehydrated: EDITED_REHYDRATED
    };

    const ORDER_FORM = document.getElementById("order");
    ORDER_FORM.onsubmit = addProduct;
    ORDER_FORM.reset();

    updateLocalStorage();
    showProducts();
  }
}

function validateEditForm(SEED, QUANTITY, TYPE, REHYDRATED) {
  updateErrorMessage("seed", SEED);
  updateErrorMessage("quantity", QUANTITY);
  updateErrorMessage("type", TYPE);
  updateErrorMessage("rehydrated", REHYDRATED);

  return SEED && QUANTITY && TYPE && REHYDRATED;
}

function cancelEdit() {
  const ORDER_FORM = document.getElementById("order");
  ORDER_FORM.onsubmit = addProduct;
  ORDER_FORM.reset();
}

function updateLocalStorage() {
  localStorage.setItem("products", JSON.stringify(PRODUCTS));
}

initialize();