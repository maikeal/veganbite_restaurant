
(function () {
  var cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("veganBiteCartNoBlank")) || [];
  } catch (error) {
    cart = [];
  }

  var galleryIndex = 0;
  var galleryTimer;

  function money(value) {
    return "$" + Number(value).toFixed(2);
  }

  function saveCart() {
    localStorage.setItem("veganBiteCartNoBlank", JSON.stringify(cart));
  }

  function openCart() {
    var drawer = document.querySelector(".cart-drawer");
    var backdrop = document.querySelector(".cart-backdrop");
    if (drawer) drawer.classList.add("open");
    if (backdrop) backdrop.classList.add("show");
  }

  function closeCart() {
    var drawer = document.querySelector(".cart-drawer");
    var backdrop = document.querySelector(".cart-backdrop");
    if (drawer) drawer.classList.remove("open");
    if (backdrop) backdrop.classList.remove("show");
  }

  function addToCart(name, price) {
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: name, price: Number(price), quantity: 1 });
    }
    saveCart();
    renderCart();
    openCart();
  }

  function changeQuantity(name, amount) {
    cart = cart.map(function (item) {
      if (item.name === name) {
        return { name: item.name, price: item.price, quantity: item.quantity + amount };
      }
      return item;
    }).filter(function (item) { return item.quantity > 0; });
    saveCart();
    renderCart();
  }

  function removeFromCart(name) {
    cart = cart.filter(function (item) { return item.name !== name; });
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  function renderCart() {
    var count = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    var total = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);

    document.querySelectorAll(".cart-count").forEach(function (node) {
      node.textContent = count;
    });

    var totalNode = document.querySelector(".cart-total");
    if (totalNode) totalNode.textContent = money(total);

    var itemsNode = document.querySelector(".cart-items");
    if (!itemsNode) return;

    if (cart.length === 0) {
      itemsNode.innerHTML = '<div class="empty-cart">Your cart is empty. Open the menu and click a vegan food item to add it.</div>';
      return;
    }

    itemsNode.innerHTML = cart.map(function (item) {
      return '<div class="cart-item">' +
        '<div><h3>' + item.name + '</h3><p>' + money(item.price) + ' each</p>' +
        '<div class="quantity-controls">' +
        '<button class="quantity-btn" type="button" data-cart-name="' + item.name + '" data-change="-1">−</button>' +
        '<strong>' + item.quantity + '</strong>' +
        '<button class="quantity-btn" type="button" data-cart-name="' + item.name + '" data-change="1">+</button>' +
        '</div></div>' +
        '<div class="cart-item-price"><strong>' + money(item.price * item.quantity) + '</strong>' +
        '<button class="remove-btn" type="button" data-remove-name="' + item.name + '">Remove</button>' +
        '</div></div>';
    }).join("");
  }

  function setGallery(index) {
    var track = document.querySelector(".gallery-track");
    var slides = document.querySelectorAll(".gallery-slide");
    var dots = document.querySelectorAll(".gallery-dots button");
    if (!track || slides.length === 0) return;
    galleryIndex = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + (galleryIndex * 100) + "%)";
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === galleryIndex);
    });
  }

  function initGallery() {
    var dotsContainer = document.querySelector(".gallery-dots");
    var slides = document.querySelectorAll(".gallery-slide");
    if (!dotsContainer || slides.length === 0) return;

    dotsContainer.innerHTML = "";
    slides.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (index + 1));
      dot.addEventListener("click", function () {
        setGallery(index);
      });
      dotsContainer.appendChild(dot);
    });

    setGallery(0);
    clearInterval(galleryTimer);
    galleryTimer = setInterval(function () {
      setGallery(galleryIndex + 1);
    }, 5000);
  }

  function initContactForms() {
    document.querySelectorAll(".contact-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        form.reset();
        var message = form.parentElement.querySelector(".success-message");
        if (message) {
          message.hidden = false;
          setTimeout(function () { message.hidden = true; }, 2500);
        }
      });
    });
  }

  document.addEventListener("click", function (event) {
    var hamburger = event.target.closest(".hamburger");
    if (hamburger) {
      var nav = document.querySelector(".nav-content");
      if (nav) nav.classList.toggle("open");
      return;
    }

    var cartButton = event.target.closest(".cart-button");
    if (cartButton) {
      openCart();
      return;
    }

    if (event.target.closest(".close-btn") || event.target.closest(".cart-backdrop")) {
      closeCart();
      return;
    }

    var clearButton = event.target.closest(".clear-btn");
    if (clearButton) {
      clearCart();
      return;
    }

    var addButton = event.target.closest(".add-btn");
    if (addButton) {
      var card = addButton.closest(".menu-card");
      if (card) addToCart(card.dataset.name, card.dataset.price);
      return;
    }

    var menuCard = event.target.closest(".menu-card");
    if (menuCard && !event.target.closest("button")) {
      addToCart(menuCard.dataset.name, menuCard.dataset.price);
      return;
    }

    var filterButton = event.target.closest(".filter-btn");
    if (filterButton) {
      var filter = filterButton.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach(function (button) {
        button.classList.remove("active");
      });
      filterButton.classList.add("active");
      document.querySelectorAll(".menu-card").forEach(function (card) {
        card.style.display = filter === "All" || card.dataset.category === filter ? "flex" : "none";
      });
      return;
    }

    var quantityButton = event.target.closest(".quantity-btn");
    if (quantityButton) {
      changeQuantity(quantityButton.dataset.cartName, Number(quantityButton.dataset.change));
      return;
    }

    var removeButton = event.target.closest(".remove-btn");
    if (removeButton) {
      removeFromCart(removeButton.dataset.removeName);
      return;
    }

    var prev = event.target.closest(".slider-btn.prev");
    if (prev) {
      setGallery(galleryIndex - 1);
      return;
    }

    var next = event.target.closest(".slider-btn.next");
    if (next) {
      setGallery(galleryIndex + 1);
      return;
    }

    var navLink = event.target.closest(".nav-link");
    if (navLink) {
      document.querySelectorAll(".nav-link").forEach(function (link) {
        link.classList.remove("active");
      });
      navLink.classList.add("active");
      var nav = document.querySelector(".nav-content");
      if (nav) nav.classList.remove("open");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCart();
  });

  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    initGallery();
    initContactForms();
  });
})();
