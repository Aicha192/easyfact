import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { clients } from "../../data/clients";
import type { Facture } from "../../types/facture";
import { useParametresStore } from "../../store/parametresStore";

function cleanText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/€/g, "EUR")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE");
}

function formatMoney(
  value: number,
  devise: string
) {
  return `${value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${devise}`;
}

export function generateInvoicePdf(
  facture: Facture,
  action: "download" | "print" = "download"
) {

  const doc = new jsPDF();

  const entreprise =
    useParametresStore.getState().parametres;

    const client = clients.find(
  (c) => c.nom === facture.client
);

  const green: [
    number,
    number,
    number
  ] = [
    16,
    185,
    129
  ];

  // =====================
  // EN-TÊTE ENTREPRISE
  // =====================

  doc.setFillColor(
    green[0],
    green[1],
    green[2]
  );

  doc.rect(
    0,
    0,
    210,
    45,
    "F"
  );

  // Logo

  if (entreprise.logo) {

    doc.addImage(
      entreprise.logo,
      "PNG",
      14,
      8,
      25,
      25
    );

  }

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.setFontSize(22);

  doc.text(
    entreprise.nomEntreprise || "EasyFact",
    45,
    18
  );

  doc.setFontSize(10);

  if (entreprise.adresse) {

    doc.text(
      entreprise.adresse,
      45,
      26
    );

  }

  if (entreprise.telephone) {

    doc.text(
      entreprise.telephone,
      45,
      32
    );

  }

  if (entreprise.email) {

    doc.text(
      entreprise.email,
      100,
      32
    );

  }

  if (entreprise.siteWeb) {

    doc.text(
      entreprise.siteWeb,
      45,
      38
    );

  }

  // =====================
  // TITRE
  // =====================

  doc.setTextColor(
    0,
    0,
    0
  );

  doc.setFontSize(22);

  doc.text(
    "FACTURE",
    150,
    60
  );

  doc.setFontSize(11);

  doc.text(
    `N° ${facture.numero}`,
    150,
    68
  );

  doc.text(
    `Statut : ${facture.statut}`,
    150,
    75
  );

    // =====================
  // INFORMATIONS CLIENT
  // =====================

  doc.setDrawColor(220);

  doc.roundedRect(
  14,
  90,
  85,
  42,
  3,
  3
);

  doc.setFontSize(10);

  doc.text(
    "CLIENT",
    20,
    100
  );

 doc.setFontSize(11);

doc.text(
  cleanText(facture.client),
  20,
  108
);

if (client?.telephone) {
  doc.setFontSize(10);

  doc.text(
    `Téléphone : ${client.telephone}`,
    20,
    116
  );
}

if (client?.email) {
  doc.text(
    `Email : ${client.email}`,
    20,
    122
  );
}

if (client?.adresse) {
  doc.text(
    cleanText(`Adresse : ${client.adresse}`),
    20,
    128
  );
}

  // =====================
  // INFORMATIONS LEGALES
  // =====================

  doc.setFontSize(10);

  if (entreprise.ninea) {

    doc.text(
      `NINEA : ${entreprise.ninea}`,
      120,
      92
    );

  }

  if (entreprise.rccm) {

    doc.text(
      `RCCM : ${entreprise.rccm}`,
      120,
      100
    );

  }

  doc.text(
    `Date émission : ${facture.dateEmission}`,
    120,
    108
  );

  doc.text(
    `Date échéance : ${facture.dateEcheance}`,
    120,
    116
  );

  // =====================
// FILIGRANE
// =====================

doc.setTextColor(235, 235, 235);

doc.setFontSize(55);

doc.text(
  "FACTURE",
  55,
  180,
  {
    angle: 45,
  }
);

// Remettre la couleur normale
doc.setTextColor(0, 0, 0);

  // =====================
  // TABLEAU PRODUITS
  // =====================

  autoTable(doc, {

    startY: 135,

    head: [
      [
        "Désignation",
        "Qté",
        "Prix unitaire",
        "Total",
      ],
    ],

    body: facture.items.map((item) => [

      cleanText(item.designation),

      item.quantite.toString(),

      formatMoney(
        item.prixUnitaire,
        entreprise.devise
      ),

      formatMoney(
        item.total,
        entreprise.devise
      ),

    ]),

    theme: "grid",

    headStyles: {

      fillColor: green,

    },

    styles: {

      fontSize: 10,

    },

  });

  const finalY =
    (
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }

    ).lastAutoTable?.finalY ?? 150;

  // =====================
  // TOTAUX
  // =====================

  doc.roundedRect(

    120,

    finalY + 10,

    75,

    45,

    3,

    3

  );

  doc.setFontSize(11);

  doc.text(
    "Montant HT",
    125,
    finalY + 22
  );

  doc.text(

    formatMoney(
      facture.montantHT,
      entreprise.devise
    ),

    190,

    finalY + 22,

    {
      align: "right",
    }

  );

  doc.text(

    `TVA (${facture.tva}%)`,

    125,

    finalY + 32

  );

  doc.text(

    formatMoney(

      facture.montantHT *
      facture.tva /
      100,

      entreprise.devise

    ),

    190,

    finalY + 32,

    {
      align: "right",
    }

  );

  doc.setFontSize(13);

  doc.setTextColor(

    green[0],

    green[1],

    green[2]

  );

  doc.text(

    "TOTAL TTC",

    125,

    finalY + 46

  );

  doc.text(

    formatMoney(

      facture.montantTTC,

      entreprise.devise

    ),

    190,

    finalY + 46,

    {
      align: "right",
    }

  );

  doc.setTextColor(
    0,
    0,
    0
  );

  // =====================
// NOTES
// =====================

if (facture.notes) {

  doc.setFontSize(11);


  doc.text(
    "Notes :",
    14,
    finalY + 75
  );

  doc.setFontSize(10);

  doc.text(
    cleanText(facture.notes),
    14,
    finalY + 83
  );

}

// =====================
// CONDITIONS DE PAIEMENT
// =====================

if (entreprise.conditionsPaiement) {

  doc.setFontSize(10);

  doc.text(
    "Conditions de paiement :",
    14,
    finalY + 100
  );

  doc.text(
    cleanText(
      entreprise.conditionsPaiement
    ),
    14,
    finalY + 108
  );

}

// =====================
// RESPONSABLE
// =====================

if (entreprise.responsable) {

  doc.text(
    `Responsable : ${entreprise.responsable}`,
    14,
    finalY + 120
  );

}

// =====================
// SIGNATURE
// =====================

doc.setFontSize(10);

doc.setFont("helvetica", "bold");

doc.text(
  "Cachet et signature",
  140,
  finalY + 118
);

doc.setFont("helvetica", "normal");

doc.line(
  140,
  finalY + 135,
  195,
  finalY + 135
);

if (entreprise.responsable) {

  doc.setFontSize(9);

  doc.text(
    entreprise.responsable,
    148,
    finalY + 142
  );

}

// =====================
// FOOTER
// =====================

doc.line(
  14,
  280,
  196,
  280
);

doc.setFontSize(9);

doc.text(
  `${entreprise.nomEntreprise || "EasyFact"} • Gestion professionnelle de factures`,
  14,
  287
);

if (entreprise.siteWeb) {

  doc.text(
    entreprise.siteWeb,
    160,
    287
  );

}

// =====================
// GENERATION
// =====================

if (action === "download") {

  doc.save(
    `${facture.numero}.pdf`
  );

} else {

  const blob = doc.output("blob");

  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url);

  if (printWindow) {

    printWindow.onload = () => {

      printWindow.print();

    };

  }

}

}