// ========================= CONFIG =========================

const WEBHOOK_URL = "https://discord.com/api/webhooks/1521049796742479953/6v3Bh7X-m18pF-Zh5drP-4vWpbTFSBKPQRpc9ouBErANkeEClM_y9yswG9FWlo4vmzU7";
const PRICE_KNIFE = 6500;

// ========================= ELEMENTS =========================

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

// ========================= PRIX =========================

function formatPrice(price) {

    return price.toLocaleString("fr-FR") + "€";

}

function updatePrice() {

    const quantity = Math.max(1, Number(knifeQuantity.value));

    totalPrice.textContent = formatPrice(quantity * PRICE_KNIFE);

}

// ========================= AFFICHAGE =========================

function updateSections() {

    if(orderType.value === "couteaux"){

        knifeSection.style.display = "block";
        contractSection.style.display = "none";

    }

    else{

        knifeSection.style.display = "none";
        contractSection.style.display = "block";

    }

}

// ========================= RECUPERATION =========================

function getData(){

    const data = {

        nom : document.getElementById("clientName").value,
        telephone : document.getElementById("phoneNumber").value,
        type : orderType.value,
        infos : document.getElementById("extraInfo").value

    };

    if(data.type === "couteaux"){

        data.quantite = knifeQuantity.value;
        data.total = knifeQuantity.value * PRICE_KNIFE;

    }

    else{

        data.point = document.getElementById("contractPoint").value;
        data.details = document.getElementById("contractDetails").value;

    }

    return data;

}

// ========================= RECAP =========================

previewButton.addEventListener("click",()=>{

    const data = getData();

    if(data.nom === "" || data.telephone === ""){

        alert("Merci de remplir tous les champs obligatoires.");

        return;

    }

    if(data.type === "couteaux"){

        summaryContent.innerHTML = `

        <div class="summaryLine">

            <strong>Nom</strong>

            ${data.nom}

        </div>

        <div class="summaryLine">

            <strong>Téléphone</strong>

            ${data.telephone}

        </div>

        <div class="summaryLine">

            <strong>Produit</strong>

            Couteaux

        </div>

        <div class="summaryLine">

            <strong>Quantité</strong>

            ${data.quantite}

        </div>

        <div class="summaryLine">

            <strong>Total</strong>

            ${formatPrice(data.total)}

        </div>

        `;

    }

    else{

        summaryContent.innerHTML = `

        <div class="summaryLine">

            <strong>Nom</strong>

            ${data.nom}

        </div>

        <div class="summaryLine">

            <strong>Téléphone</strong>

            ${data.telephone}

        </div>

        <div class="summaryLine">

            <strong>Contrat</strong>

            ${data.point}

        </div>

        <div class="summaryLine">

            <strong>Détails</strong>

            ${data.details}

        </div>

        `;

    }

    currentPayload = data;

    summaryModal.classList.remove("hidden");

});

// ========================= FERMER =========================

editButton.addEventListener("click",()=>{

    summaryModal.classList.add("hidden");

});

// ========================= ENVOI DISCORD =========================

confirmButton.addEventListener("click",async()=>{

    let embed;

    if(currentPayload.type === "couteaux"){

        embed = {

            title:"🔪 Nouvelle commande",

            color:15158332,

            fields:[

                {

                    name:"👤 Client",

                    value:currentPayload.nom,

                    inline:true

                },

                {

                    name:"📞 Téléphone",

                    value:currentPayload.telephone,

                    inline:true

                },

                {

                    name:"📦 Quantité",

                    value:String(currentPayload.quantite),

                    inline:true

                },

                {

                    name:"💰 Total",

                    value:formatPrice(currentPayload.total),

                    inline:true

                },

                {

                    name:"📝 Informations",

                    value:currentPayload.infos || "Aucune"

                }

            ]

        };

    }

    else{

        embed = {

            title:"📍 Nouveau contrat",

            color:3066993,

            fields:[

                {

                    name:"👤 Client",

                    value:currentPayload.nom,

                    inline:true

                },

                {

                    name:"📞 Téléphone",

                    value:currentPayload.telephone,

                    inline:true

                },

                {

                    name:"📍 Point",

                    value:currentPayload.point || "Aucun"

                },

                {

                    name:"📝 Détails",

                    value:currentPayload.details || "Aucun"

                },

                {

                    name:"📄 Informations",

                    value:currentPayload.infos || "Aucune"

                }

            ]

        };

    }

    await fetch(WEBHOOK_URL,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            username:"Commandes RP",

            embeds:[embed]

        })

    });

    summaryModal.classList.add("hidden");

    successOverlay.classList.remove("hidden");

    setTimeout(()=>{

        successOverlay.classList.add("hidden");

        document.getElementById("orderForm").reset();

        knifeQuantity.value = 1;

        updatePrice();

        updateSections();

    },2500);

});

// ========================= EVENTS =========================

knifeQuantity.addEventListener("input",updatePrice);

orderType.addEventListener("change",updateSections);

// ========================= DEMARRAGE =========================

updatePrice();
updateSections();
