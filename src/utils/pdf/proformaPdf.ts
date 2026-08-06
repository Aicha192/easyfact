import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { clients } from "../../data/clients";
import type { Proforma } from "../../types/proforma";
import { useParametresStore } from "../../store/parametresStore";


function cleanText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


function formatMoney(
  value: number,
  devise: string
) {
  return `${value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${devise}`;
}

export function generateProformaPdf(
  proforma: Proforma,
  action: "download" | "print" = "download"
) {

  const doc = new jsPDF();

   const entreprise =
  useParametresStore.getState().parametres;

  const client = clients.find(
  (c) => c.nom === proforma.client
);

 const green: [number, number, number] = [
  16,
  185,
  129,
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

doc.setTextColor(255, 255, 255);

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

 doc.setTextColor(0);

doc.setFontSize(22);

doc.text(
  "PROFORMA",
  150,
  60
);

doc.setFontSize(11);

doc.text(
  `N° ${proforma.numero}`,
  150,
  68
);

doc.text(
  `Statut : ${proforma.statut}`,
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
  cleanText(proforma.client),
  20,
  108
);

if (client?.email) {
  doc.setFontSize(9);

  doc.text(
    `Email : ${client.email}`,
    20,
    115
  );
}

if (client?.telephone) {
  doc.text(
    `Téléphone : ${client.telephone}`,
    20,
    121
  );
}

if (client?.adresse) {
  doc.text(
    `Adresse : ${cleanText(client.adresse)}`,
    20,
    127
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
  `Date émission : ${proforma.dateEmission}`,
  120,
  108
);

doc.text(
  `Validité : ${proforma.dateValidite}`,
  120,
  116
);

// =====================
// FILIGRANE
// =====================

doc.setTextColor(235, 235, 235);

doc.setFontSize(55);

doc.text(
  "PROFORMA",
  40,
  180,
  {
    angle: 45,
  }
);

// Remettre la couleur normale
doc.setTextColor(0, 0, 0);

  // =====================
  // TABLEAU
  // =====================


  autoTable(doc, {

    startY: 145,


    head: [[
      "Designation",
      "Qte",
      "Prix unitaire",
      "Total",
    ]],


    body: proforma.items.map(
      (item) => [

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

      ]
    ),

    theme: "grid",

    headStyles: {

      fillColor: [
        16,
        185,
        129
      ],

    },

  });

  const finalY =
    (doc as jsPDF & {
      lastAutoTable?: {
        finalY: number;
      }
    })
    .lastAutoTable?.finalY ?? 120;

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
    proforma.montantHT,
    entreprise.devise
  ),
  190,
  finalY + 22,
  {
    align: "right",
  }
);

doc.text(
  `TVA (${proforma.tva}%)`,
  125,
  finalY + 32
);

doc.text(
  formatMoney(
    proforma.montantHT * proforma.tva / 100,
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
    proforma.montantTTC,
    entreprise.devise
  ),
  190,
  finalY + 46,
  {
    align: "right",
  }
);

doc.setTextColor(0);

 // =====================
// NOTES
// =====================

if (proforma.notes) {

  doc.setFontSize(11);

  doc.text(
    "Notes :",
    14,
    finalY + 75
  );

  doc.setFontSize(10);

  doc.text(
    cleanText(proforma.notes),
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

  if (action === "download") {

  doc.save(
    `${proforma.numero}.pdf`
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