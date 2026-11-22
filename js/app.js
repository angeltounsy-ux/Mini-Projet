document.addEventListener("DOMContentLoaded", function () {
  // 1. Simulateur dans index.html
  const simForm = document.getElementById("simForm");
  if (simForm) {
    simForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const prixJour = Number(document.getElementById("carType").value);
      const nbJours = Number(document.getElementById("daysCount").value);
      const simResult = document.getElementById("simResult");

      if (nbJours < 1) {
        simResult.className = "alert alert-danger mt-3";
        simResult.textContent = "Entrez un nombre de jours supérieur ou égal à 1.";
        return;
      }

      const total = prixJour * nbJours;
      simResult.className = "alert alert-success mt-3";
      simResult.textContent = "Total estimé : " + total + " TND pour " + nbJours + " jour(s).";
    });
  }

  // 2. Recherche et filtre dans catalogue.html
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const resetFilterBtn = document.getElementById("resetFilterBtn");
  const carItems = document.querySelectorAll(".car-item");

  function filtrerVoitures() {
    if (!searchInput || !categoryFilter) return;

    const texte = searchInput.value.toLowerCase().trim();
    const categorie = categoryFilter.value;

    carItems.forEach(function (carte) {
      const nom = carte.getAttribute("data-name") || "";
      const cat = carte.getAttribute("data-category") || "";

      const correspondNom = nom.includes(texte);
      const correspondCat = categorie === "all" || cat === categorie;

      if (correspondNom && correspondCat) {
        carte.style.display = "block";
      } else {
        carte.style.display = "none";
      }
    });
  }

  if (searchInput) searchInput.addEventListener("input", filtrerVoitures);
  if (categoryFilter) categoryFilter.addEventListener("change", filtrerVoitures);
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", function () {
      searchInput.value = "";
      categoryFilter.value = "all";
      filtrerVoitures();
    });
  }

  // 3. Choisir une voiture depuis la carte
  const selectButtons = document.querySelectorAll(".select-car-btn");
  const selectedCar = document.getElementById("selectedCar");

  selectButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const prix = btn.getAttribute("data-price");
      if (selectedCar) {
        selectedCar.value = prix;
        document.getElementById("reservationSection").scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 4. Réservation, facture et retour de voiture
  const bookingForm = document.getElementById("bookingForm");
  const returnCarBtn = document.getElementById("returnCarBtn");
  const billBox = document.getElementById("billBox");

  if (bookingForm && billBox) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nomClient = document.getElementById("clientName").value.trim();
      const prix = Number(selectedCar.value);
      const optionChoisie = selectedCar.options[selectedCar.selectedIndex];
      const nomVoiture = optionChoisie.getAttribute("data-label");
      const jours = Number(document.getElementById("rentalDays").value);

      if (nomClient === "" || jours < 1) {
        billBox.innerHTML = '<p class="text-danger mb-0">Veuillez remplir le nom et un nombre de jours valide.</p>';
        return;
      }

      const montant = prix * jours;
      billBox.innerHTML =
        "<p><strong>Statut :</strong> Réservée</p>" +
        "<p><strong>Client :</strong> " + nomClient + "</p>" +
        "<p><strong>Voiture :</strong> " + nomVoiture + "</p>" +
        "<p><strong>Durée :</strong> " + jours + " jour(s)</p>" +
        "<p class='mb-0'><strong>Total à payer :</strong> " + montant + " TND</p>";
    });
  }

  if (returnCarBtn && billBox) {
    returnCarBtn.addEventListener("click", function () {
      billBox.innerHTML =
        "<p class='text-success mb-1'><strong>Voiture rendue avec succès !</strong></p>" +
        "<p class='mb-0'>Le véhicule est de nouveau disponible pour une nouvelle location.</p>";
    });
  }

  // 5. Inscription client (verification + localStorage)
  const registerForm = document.getElementById("registerForm");
  const registerMsg = document.getElementById("registerMsg");

  if (registerForm && registerMsg) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nom = document.getElementById("regNom").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const permis = document.getElementById("regPermis").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirm = document.getElementById("regConfirm").value;

      if (nom.length < 3) {
        registerMsg.innerHTML = '<div class="alert alert-danger">Le nom doit contenir au moins 3 caractères.</div>';
        return;
      }

      if (permis === "") {
        registerMsg.innerHTML = '<div class="alert alert-danger">Veuillez entrer votre numéro de permis.</div>';
        return;
      }

      if (password.length < 6) {
        registerMsg.innerHTML = '<div class="alert alert-danger">Le mot de passe doit contenir au moins 6 caractères.</div>';
        return;
      }

      if (password !== confirm) {
        registerMsg.innerHTML = '<div class="alert alert-danger">Les deux mots de passe ne correspondent pas.</div>';
        return;
      }

      const utilisateur = {
        nom: nom,
        email: email,
        permis: permis,
        password: password
      };

      localStorage.setItem("autoRouteUser", JSON.stringify(utilisateur));
      registerMsg.innerHTML =
        '<div class="alert alert-success">Compte créé avec succès ! Vous pouvez maintenant <a href="connexion.html">vous connecter</a>.</div>';
      registerForm.reset();
    });
  }

  // 6. Connexion client
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  if (loginForm && loginMsg) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const savedData = localStorage.getItem("autoRouteUser");

      if (!savedData) {
        loginMsg.innerHTML =
          '<div class="alert alert-warning">Aucun compte trouvé. Commencez par <a href="inscription.html">vous inscrire</a>.</div>';
        return;
      }

      const utilisateur = JSON.parse(savedData);

      if (email === utilisateur.email && password === utilisateur.password) {
        loginMsg.innerHTML =
          '<div class="alert alert-success">Bienvenue <strong>' +
          utilisateur.nom +
          '</strong> ! Vous êtes connecté. <a href="catalogue.html">Voir les voitures</a>.</div>';
      } else {
        loginMsg.innerHTML = '<div class="alert alert-danger">E-mail ou mot de passe incorrect.</div>';
      }
    });
  }
});