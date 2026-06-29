const WEBHOOK_URL = "https://discord.com/api/webhooks/1521049796742479953/6v3Bh7X-m18pF-Zh5drP-4vWpbTFSBKPQRpc9ouBErANkeEClM_y9yswG9FWlo4vmzU7";

const PRICE_KNIFE = 6500;

const clientNameInput = document.getElementById("clientName");
const groupNameInput = document.getElementById("groupName");
const phoneNumberInput = document.getElementById("phoneNumber");
const extraInfoInput = document.getElementById("extraInfo");

const showKnivesButton = document.getElementById("showKnivesButton");
const showLsdButton = document.getElementById("showLsdButton");

const knifeSection = document.getElementById("knifeSection");
const lsdSection = document.getElementById("lsdSection");

const knifeQuantityInput = document.getElementById("knifeQuantityInput");
const knifePreviewPrice = document.getElementById("knifePreviewPrice");
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

let cart = [];
let currentPayload = null;

function formatPrice(price) {
  return price.toLocaleString("fr-FR") + "€";
}

function updateKnifePrice() {
  const quantity = Math.max(1, Number(knifeQuantityInput.value || 1));
  knifePreviewPrice.textContent = formatPrice(quantity * PRICE_KNIFE);
}

function showSection(section) {
  if (section === "knives") {
    knifeSection.classList.remove("hidden");
    lsdSection.classList.add("hidden");

    showKnivesButton.classList.add("activeChoice");
    showLsdButton.classList.remove("activeChoice");
  } else {
    knifeSection.classList.add("hidden");
    lsdSection.classList.remove("hidden");

    showKnivesButton.classList.remove("activeChoice");
    showLsdButton.classList.add("activeChoice");
  }
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

addKnivesButton.addEventListener("click", () => {
  const quantity = Math.max(1, Number(knifeQuantityInput.value || 1));
  const total = quantity * PRICE_KNIFE;

  cart.push({
    type: "couteaux",
    name: "Couteaux",
    quantity: quantity,
    price: PRICE_KNIFE,
    total: total,
    description: `${quantity} x ${formatPrice(PRICE_KNIFE)} = ${formatPrice(total)}`
  });

  knifeQuantityInput.value = 1;
  updateKnifePrice();
  updateCart();
});

addLsdButton.addEventListener("click", () => {
  const selectedOption = lsdType.options[lsdType.selectedIndex];

  const name = selectedOption.dataset.name;
  const price = Number(selectedOption.dataset.price);

  cart.push({
    type: "lsd",
    name: name,
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
  username: "Golden Spur | Commandes",
  avatar_url: "https://chatgpt.com/backend-api/estuary/content?id=file_00000000210471f4b938e6a9d8ad4c9f&ts=495209&p=fs&cid=1&sig=44c54e723eccc25d5672ced83b80e5f0f40582fce9eab9fbcde468c9f66972ed&v=0",
  embeds: [
    {
      title: "📦 Nouvelle commande reçue",
      description: "Une nouvelle commande vient d’être envoyée depuis le portail Golden Spur.",
      color: 0xb91c1c,

     fields: [
{
    name: "👤 Client",
    value: `\`${clientName}\``,
    inline: true
},
{
    name: "👥 Groupe",
    value: `\`${groupName}\``,
    inline: true
},
{
    name: "\u200B",
    value: "\u200B",
    inline: false
},
{
    name: "📞 Téléphone",
    value: `\`${phoneNumber}\``,
    inline: true
},
{
    name: "💰 Total",
    value: `**${formatPrice(total)}**`,
    inline: true
},

      footer: {
        text: "Golden Spur • Système de commandes RP"
      },

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
      currentPayload = null;

      knifeQuantityInput.value = 1;

      showSection("knives");
      updateKnifePrice();
      updateCart();
    }, 2500);
  } catch (error) {
    alert("Erreur lors de l'envoi de la commande.");
  }

  confirmButton.disabled = false;
  confirmButton.textContent = "Valider la commande";
});

showKnivesButton.addEventListener("click", () => {
  showSection("knives");
});

showLsdButton.addEventListener("click", () => {
  showSection("lsd");
});

knifeQuantityInput.addEventListener("input", updateKnifePrice);

showSection("knives");
updateKnifePrice();
updateCart();
