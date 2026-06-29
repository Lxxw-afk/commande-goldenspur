const WEBHOOK_URL = "TON_WEBHOOK_DISCORD_ICI";

const PRICE_KNIFE = 6500;

const form = document.getElementById("orderForm");
const orderType = document.getElementById("orderType");
const knifeSection = document.getElementById("knifeSection");
const contractSection = document.getElementById("contractSection");
const knifeQuantity = document.getElementById("knifeQuantity");
const totalPrice = document.getElementById("totalPrice");
const statusMessage = document.getElementById("statusMessage");

function formatPrice(price) {
  return price.toLocaleString("fr-FR") + "€";
}

function updatePrice() {
  const quantity = Math.max(1, Number(knifeQuantity.value || 1));
  const total = quantity * PRICE_KNIFE;
  totalPrice.textContent = formatPrice(total);
}

function updateSections() {
  if (orderType.value === "couteaux") {
    knifeSection.classList.remove("hidden");
    contractSection.classList.add("hidden");
  } else {
    knifeSection.classList.add("hidden");
    contractSection.classList.remove("hidden");
  }
}

knifeQuantity.addEventListener("input", updatePrice);
orderType.addEventListener("change", updateSections);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (WEBHOOK_URL === "TON_WEBHOOK_DISCORD_ICI") {
    showMessage("Ajoute ton webhook Discord dans script.js avant d’envoyer.", "error");
    return;
  }

  const clientName = document.getElementById("clientName").value.trim();
  const discordName = document.getElementById("discordName").value.trim();
  const extraInfo = document.getElementById("extraInfo").value.trim();
  const type = orderType.value;

  let embed;

  if (type === "couteaux") {
    const quantity = Math.max(1, Number(knifeQuantity.value || 1));
    const total = quantity * PRICE_KNIFE;

    embed = {
      title: "Nouvelle commande RP",
      color: 12000284,
      fields: [
        { name: "Client RP", value: clientName, inline: true },
        { name: "Discord", value: discordName, inline: true },
        { name: "Type", value: "Couteaux", inline: true },
        { name: "Quantité", value: String(quantity), inline: true },
        { name: "Prix total", value: formatPrice(total), inline: true },
        { name: "Infos supplémentaires", value: extraInfo || "Aucune information" }
      ],
      timestamp: new Date().toISOString()
    };
  } else {
    const contractPoint = document.getElementById("contractPoint").value.trim();
    const contractDetails = document.getElementById("contractDetails").value.trim();

    embed = {
      title: "Nouveau contrat RP",
      color: 5814783,
      fields: [
        { name: "Client RP", value: clientName, inline: true },
        { name: "Discord", value: discordName, inline: true },
        { name: "Type", value: "Contrat point de drogue", inline: true },
        { name: "Point concerné", value: contractPoint || "Non précisé" },
        { name: "Détails du contrat", value: contractDetails || "Non précisé" },
        { name: "Infos supplémentaires", value: extraInfo || "Aucune information" }
      ],
      timestamp: new Date().toISOString()
    };
  }

  const payload = {
    username: "Commandes RP",
    embeds: [embed]
  };

  try {
    setButtonState(true);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Erreur Discord");
    }

    form.reset();
    knifeQuantity.value = 1;
    updatePrice();
    updateSections();
    showMessage("Commande envoyée avec succès.", "success");
  } catch (error) {
    showMessage("Erreur lors de l’envoi de la commande.", "error");
  } finally {
    setButtonState(false);
  }
});

function setButtonState(disabled) {
  const button = form.querySelector("button");
  button.disabled = disabled;
  button.textContent = disabled ? "Envoi en cours..." : "Envoyer la commande";
}

function showMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

updatePrice();
updateSections();
