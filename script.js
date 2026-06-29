const WEBHOOK_URL = "https://discord.com/api/webhooks/1521049796742479953/6v3Bh7X-m18pF-Zh5drP-4vWpbTFSBKPQRpc9ouBErANkeEClM_y9yswG9FWlo4vmzU7";
const PRICE_KNIFE = 6500;

const form = document.getElementById("orderForm");
const orderType = document.getElementById("orderType");
const knifeSection = document.getElementById("knifeSection");
const contractSection = document.getElementById("contractSection");
const knifeQuantity = document.getElementById("knifeQuantity");
const totalPrice = document.getElementById("totalPrice");

const previewButton = document.getElementById("previewButton");
const summaryModal = document.getElementById("summaryModal");
const summaryContent = document.getElementById("summaryContent");
const editButton = document.getElementById("editButton");
const confirmButton = document.getElementById("confirmButton");
const successOverlay = document.getElementById("successOverlay");

let currentPayload = null;

function formatPrice(price) {
  return price.toLocaleString("fr-FR") + "€";
}

function updatePrice() {
  const quantity = Math.max(1, Number(knifeQuantity.value || 1));
  totalPrice.textContent = formatPrice(quantity * PRICE_KNIFE);
}

function updateSections() {
  if (orderType.value === "couteaux") {
    knifeSection.style.display = "block";
    contractSection.style.display = "none";
  } else {
    knifeSection.style.display = "none";
    contractSection.style.display = "block";
  }
}

function getData() {
  const clientName = document.getElementById("clientName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const extraInfo = document.getElementById("extraInfo").value.trim();

  if (!clientName || !phoneNumber) {
    alert("Merci de remplir le nom et le numéro de téléphone.");
    return null;
  }

  if (orderType.value === "couteaux") {
    const quantity = Math.max(1, Number(knifeQuantity.value || 1));
    const total = quantity * PRICE_KNIFE;

    return {
      type: "couteaux",
      clientName,
      phoneNumber,
      quantity,
      total,
      extraInfo
    };
  }

  const contractPoint = document.getElementById("contractPoint").value.trim();
  const contractDetails = document.getElementById("contractDetails").value.trim();

  return {
    type: "contrat",
    clientName,
    phoneNumber,
    contractPoint,
    contractDetails,
    extraInfo
  };
}

function showSummary(data) {
  if (data.type === "couteaux") {
    summaryContent.innerHTML = `
      <div class="summaryLine"><strong>Nom</strong>${data.clientName}</div>
      <div class="summaryLine"><strong>Téléphone</strong>${data.phoneNumber}</div>
      <div class="summaryLine"><strong>Commande</strong>Couteaux</div>
      <div class="summaryLine"><strong>Quantité</strong>${data.quantity}</div>
      <div class="summaryLine"><strong>Prix total</strong>${formatPrice(data.total)}</div>
      <div class="summaryLine"><strong>Informations</strong>${data.extraInfo || "Aucune"}</div>
    `;
  } else {
    summaryContent.innerHTML = `
      <div class="summaryLine"><strong>Nom</strong>${data.clientName}</div>
      <div class="summaryLine"><strong>Téléphone</strong>${data.phoneNumber}</div>
      <div class="summaryLine"><strong>Type</strong>Contrat point de drogue</div>
      <div class="summaryLine"><strong>Point concerné</strong>${data.contractPoint || "Non précisé"}</div>
      <div class="summaryLine"><strong>Détails</strong>${data.contractDetails || "Non précisé"}</div>
      <div class="summaryLine"><strong>Informations</strong>${data.extraInfo || "Aucune"}</div>
    `;
  }

  summaryModal.classList.remove("hidden");
}

function buildDiscordPayload(data) {
  if (data.type === "couteaux") {
    return {
      username: "Commandes Golden Spur",
      embeds: [{
        title: "🔪 Nouvelle commande",
        color: 15158332,
        fields: [
          { name: "Client", value: data.clientName, inline: true },
          { name: "Téléphone", value: data.phoneNumber, inline: true },
          { name: "Commande", value: "Couteaux", inline: true },
          { name: "Quantité", value: String(data.quantity), inline: true },
          { name: "Prix total", value: formatPrice(data.total), inline: true },
          { name: "Informations", value: data.extraInfo || "Aucune" }
        ],
        timestamp: new Date().toISOString()
      }]
    };
  }

  return {
    username: "Commandes Golden Spur",
    embeds: [{
      title: "📍 Nouveau contrat",
      color: 3066993,
      fields: [
        { name: "Client", value: data.clientName, inline: true },
        { name: "Téléphone", value: data.phoneNumber, inline: true },
        { name: "Type", value: "Contrat point de drogue", inline: true },
        { name: "Point concerné", value: data.contractPoint || "Non précisé" },
        { name: "Détails", value: data.contractDetails || "Non précisé" },
        { name: "Informations", value: data.extraInfo || "Aucune" }
      ],
      timestamp: new Date().toISOString()
    }]
  };
}

previewButton.addEventListener("click", () => {
  const data = getData();
  if (!data) return;

  currentPayload = buildDiscordPayload(data);
  showSummary(data);
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
      knifeQuantity.value = 1;
      updatePrice();
      updateSections();
    }, 2500);

  } catch (error) {
    alert("Erreur lors de l'envoi de la commande.");
  }

  confirmButton.disabled = false;
  confirmButton.textContent = "Valider la commande";
});

knifeQuantity.addEventListener("input", updatePrice);
orderType.addEventListener("change", updateSections);

updatePrice();
updateSections();
