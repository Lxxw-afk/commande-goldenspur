const WEBHOOK_URL = "https://discord.com/api/webhooks/1521049796742479953/6v3Bh7X-m18pF-Zh5drP-4vWpbTFSBKPQRpc9ouBErANkeEClM_y9yswG9FWlo4vmzU7";

const PRICE_KNIFE = 6500;

const clientNameInput = document.getElementById("clientName");
const groupNameInput = document.getElementById("groupName");
const phoneNumberInput = document.getElementById("phoneNumber");
const extraInfoInput = document.getElementById("extraInfo");

const minusKnife = document.getElementById("minusKnife");
const plusKnife = document.getElementById("plusKnife");
const knifeQuantityDisplay = document.getElementById("knifeQuantityDisplay");
const addKnivesButton = document.getElementById("addKnivesButton");

const lsdType = document.getElementById("lsdType");
const addLsdButton = document.getElementById("addLsdButton");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const previewButton = document.getElementById("previewButton");
const summaryModal = document.getElementById("summaryModal");
const summaryContent = document.getElementById("summaryContent");
const editButton = document.getElementById("editButton");
const confirmButton = document.getElementById("confirmButton");
const successOverlay = document.getElementById("successOverlay");
const form = document.getElementById("orderForm");

let knifeQuantity = 1;
let cart = [];
let currentPayload = null;

function formatPrice(price) {
  return price.toLocaleString("fr-FR") + "€";
}

function updateKnifeDisplay() {
  knifeQuantityDisplay.textContent = knifeQuantity;
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cartEmpty">Votre panier est vide.</p>`;
    cartTotal.textContent = "0€";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.total;

    cartItems.innerHTML += `
      <div class="cartItem">
        <div class="cartItemInfo">
          <strong>${item.name}</strong>
          <span>${item.description}</span>
        </div>

        <button type="button" class="removeItem" onclick="removeItem(${index})">
          Retirer
        </button>
      </div>
    `;
  });

  cartTotal.textContent = formatPrice(total);
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

minusKnife.addEventListener("click", () => {
  if (knifeQuantity > 1) {
    knifeQuantity--;
    updateKnifeDisplay();
  }
});

plusKnife.addEventListener("click", () => {
  knifeQuantity++;
  updateKnifeDisplay();
});

addKnivesButton.addEventListener("click", () => {
  const total = knifeQuantity * PRICE_KNIFE;

  cart.push({
    type: "couteaux",
    name: "🔪 Couteaux",
    quantity: knifeQuantity,
    price: PRICE_KNIFE,
    total: total,
    description: `${knifeQuantity} x ${formatPrice(PRICE_KNIFE)} = ${formatPrice(total)}`
  });

  knifeQuantity = 1;
  updateKnifeDisplay();
  updateCart();
});

addLsdButton.addEventListener("click", () => {
  const selectedOption = lsdType.options[lsdType.selectedIndex];

  const name = selectedOption.dataset.name;
  const price = Number(selectedOption.dataset.price);

  cart.push({
    type: "lsd",
    name: "🧪 " + name,
    quantity: 1,
    price: price,
    total: price,
    description: formatPrice(price)
  });

  updateCart();
});

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.total, 0);
}

function getCartText() {
  return cart
    .map((item) => `- ${item.name} : ${item.description}`)
    .join("\n");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

previewButton.addEventListener("click", () => {
  const clientName = clientNameInput.value.trim();
  const groupName = groupNameInput.value.trim();
  const phoneNumber = phoneNumberInput.value.trim();
  const extraInfo = extraInfoInput.value.trim();

  if (!clientName || !groupName || !phoneNumber) {
    alert("Merci de remplir le nom, le groupe et le numéro de téléphone.");
    return;
  }

  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  const total = getCartTotal();

  summaryContent.innerHTML = `
    <div class="summaryLine">
      <strong>Nom / Prénom</strong>
      ${escapeHtml(clientName)}
    </div>

    <div class="summaryLine">
      <strong>Groupe</strong>
      ${escapeHtml(groupName)}
    </div>

    <div class="summaryLine">
      <strong>Téléphone</strong>
      ${escapeHtml(phoneNumber)}
    </div>

    <div class="summaryLine">
      <strong>Panier</strong>
      ${escapeHtml(getCartText()).replaceAll("\n", "<br>")}
    </div>

    <div class="summaryLine">
      <strong>Total</strong>
      ${formatPrice(total)}
    </div>

    <div class="summaryLine">
      <strong>Informations supplémentaires</strong>
      ${escapeHtml(extraInfo || "Aucune")}
    </div>
  `;

  currentPayload = {
    username: "Commandes Golden Spur",
    embeds: [
      {
        title: "🛒 Nouvelle commande",
        color: 15158332,
        fields: [
          {
            name: "👤 Client",
            value: clientName,
            inline: true
          },
          {
            name: "👥 Groupe",
            value: groupName,
            inline: true
          },
          {
            name: "📞 Téléphone",
            value: phoneNumber,
            inline: true
          },
          {
            name: "📦 Panier",
            value: getCartText()
          },
          {
            name: "💰 Total",
            value: formatPrice(total),
            inline: true
          },
          {
            name: "📝 Informations",
            value: extraInfo || "Aucune"
          }
        ],
        timestamp: new Date().toISOString()
      }
    ]
  };

  summaryModal.classList.remove("hidden");
});

editButton.addEventListener("click", () => {
  summaryModal.classList.add("hidden");
});

confirmButton.addEventListener("click", async () => {
  if (!currentPayload) return;

  if (WEBHOOK_URL === "TON_WEBHOOK_DISCORD_ICI") {
    alert("Ajoute ton webhook Discord dans script.js.");
    return;
  }

  confirmButton.disabled = true;
  confirmButton.textContent = "Envoi...";

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentPayload)
    });

    if (!response.ok) {
      throw new Error("Erreur Discord");
    }

    summaryModal.classList.add("hidden");
    successOverlay.classList.remove("hidden");

    setTimeout(() => {
      successOverlay.classList.add("hidden");

      form.reset();
      cart = [];
      knifeQuantity = 1;
      currentPayload = null;

      updateKnifeDisplay();
      updateCart();
    }, 2500);
  } catch (error) {
    alert("Erreur lors de l'envoi de la commande.");
  }

  confirmButton.disabled = false;
  confirmButton.textContent = "Valider la commande";
});

updateKnifeDisplay();
updateCart();
