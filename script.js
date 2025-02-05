document.addEventListener("DOMContentLoaded", function () {
    // Warenkorb initialisieren
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartBadge();
    updateCartAside();

    // Produkte zum Warenkorb hinzufügen
    document.querySelectorAll(".product button").forEach(button => {
        button.addEventListener("click", function () {
            const productElement = this.parentElement;
            const product = getProductData(productElement);

            addToCart(product);
            showSnackbar(`${product.name} wurde zum Warenkorb hinzugefügt!`);
            animateProductToCart(productElement.querySelector("img"));
            updateCartAside();
        });
    });

    // Produktdaten auslesen
    function getProductData(productElement) {
        const priceText = productElement.querySelector("p").innerText.replace("€", "").trim();
        const price = parseFloat(priceText.replace(",", "."));  // Korrigiert Komma-zu-Punkt-Konvertierung

        console.log("Preis geparst:", price);  // Debugging des Preises

        return {
            name: productElement.querySelector("h3").innerText,
            price: price,
            image: productElement.querySelector("img").src
        };
    }

    // Produkt zum Warenkorb hinzufügen und speichern
    function addToCart(product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
        console.log("Aktueller Warenkorb:", cart);  // Debugging des Warenkorbs
    }

    // Warenkorb-Badge aktualisieren
    function updateCartBadge() {
        const cardBadge = document.querySelector(".cart-count");
        if (cardBadge) {
            cardBadge.innerText= cart.length;
        } else {
            console.error("Das Element '.cart-count' wurde nicht gefunden.")
        }
    }

    function updateCartAside() {
        const asideCartContainer = document.querySelector(".cart-items-aside");
        const asideTotalPrice = document.getElementById("aside-total-price")
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        asideCartContainer.innerHTML = "";  // Clear previous content
        let totalPrice = 0;
    
        if (cart.length === 0) {
            asideCartContainer.innerHTML = "<p>Warenkorb ist leer.</p>";
            document.getElementById("aside-total-price").innerText = "0€";
            return;
        }
    
        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item-aside";
            cartItem.innerHTML = `
                <p>${item.name} - ${item.price.toFixed(2)}€</p>
            `;
            asideCartContainer.appendChild(cartItem);
            totalPrice += item.price;
        });
    
        document.getElementById("aside-total-price").innerText = `${totalPrice.toFixed(2)}€`;
    }

    // Animation: Produktbild fliegt zum Warenkorb
    function animateProductToCart(productImage) {
        const flyingImage = productImage.cloneNode(true);
        flyingImage.classList.add('flying-image');
        document.body.appendChild(flyingImage);

        const rect = productImage.getBoundingClientRect();
        flyingImage.style.position = 'fixed';
        flyingImage.style.left = `${rect.left}px`;
        flyingImage.style.top = `${rect.top}px`;
        flyingImage.style.width = '100px';
        flyingImage.style.zIndex = '1000';

        const cartIcon = document.querySelector('.cart-icon');
        const cartRect = cartIcon.getBoundingClientRect();

        setTimeout(() => {
            flyingImage.style.transition = 'all 0.8s ease-in-out';
            flyingImage.style.left = `${cartRect.left + cartRect.width / 2 - 25}px`;
            flyingImage.style.top = `${cartRect.top}px`;
            flyingImage.style.width = '50px';
            flyingImage.style.opacity = '0';
        }, 50);

        flyingImage.addEventListener('transitionend', () => {
            flyingImage.remove();
            cartIcon.classList.add('cart-bounce');
            setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
        });
    }

    // Snackbar anzeigen
    function showSnackbar(message) {
        const snackbar = document.createElement('div');
        snackbar.innerText = message;
        snackbar.className = 'snackbar';
        document.body.appendChild(snackbar);
        setTimeout(() => snackbar.classList.add('visible'), 50);
        setTimeout(() => snackbar.remove(), 3000);
    }

    // Warenkorbseite: Inhalte anzeigen und aktualisieren
    if (document.body.classList.contains("cart-page")) {
        updateCartPage();
    }

    function updateCartPage() {
        console.log("updateCartPage() wurde aufgerufen.");  // Debugging

       
    
        const cartContainer = document.querySelector(".cart-items");
        cartContainer.innerHTML = "";
    
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("Geladener Warenkorb:", cart);  // Zeigt die Produkte aus dem localStorage
    
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Dein Warenkorb ist leer. <a href='shop.html'>Weiter einkaufen</a></p>";
            document.getElementById("total-price").innerText = "0€";
            return;
        }
    
        let totalPrice = 0;
        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 75px; height: 75px;">
                <div>
                    <p><strong>${item.name}</strong></p>
                    <p>${item.price.toFixed(2)}€</p>
                </div>
                <button class="remove-item" data-index="${index}">🗑️ Entfernen</button>
            `;
            cartContainer.appendChild(cartItem);
            totalPrice += item.price;
        });
    
        document.getElementById("total-price").innerText = `${totalPrice.toFixed(2)}€`;
    
        // Event-Listener für Entfernen-Buttons
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartPage();  // Warenkorb neu laden
            });
        });
    }

    
    
    

    // Checkout-Formular validieren
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const email = document.getElementById("email").value;
            const payment = document.getElementById("payment").value;

            if (!name || !address || !email || !payment) {
                alert("Bitte fülle alle Felder aus.");
                return;
            }

            alert("Bestellung erfolgreich! Danke für deinen Einkauf.");
            localStorage.removeItem("cart");
            cart = [];
            updateCartBadge();
            window.location.href = "index.html";
        });
    }

    // Registrierung validieren und speichern
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (!name || !email || !password || !confirmPassword) {
                alert("Bitte fülle alle Felder aus.");
                return;
            }

            if (password.length < 6) {
                alert("Das Passwort muss mindestens 6 Zeichen lang sein.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Die Passwörter stimmen nicht überein.");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.email === email)) {
                alert("Diese E-Mail ist bereits registriert.");
                return;
            }

            users.push({ name, email, password: btoa(password) });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
            window.location.href = "login.html";
        });
    }

    // Login-Funktion
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.email === email && user.password === btoa(password));

            if (!user) {
                alert("E-Mail oder Passwort ist falsch.");
                return;
            }

            alert("Login erfolgreich! Willkommen, " + user.name);
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "index.html";
        });
    }

    // Logout-Funktion
    const logoutButton = document.getElementById("logout-btn");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        logoutButton.style.display = "block";
        document.getElementById("user-greeting").innerText = `Hallo, ${loggedInUser.name}!`;
        document.getElementById("user-greeting").style.display = "block";
        document.getElementById("login-link").style.display = "none";
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            alert("Du wurdest erfolgreich ausgeloggt!");
            window.location.href = "login.html";
        });
    }
});
updateCartAside();  // Warenkorb beim Laden der Seite aktualisieren
