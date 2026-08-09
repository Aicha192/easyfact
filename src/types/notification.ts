export interface Notification {

  id: number;

  title: string;

  message: string;

 createdAt: number;

  read: boolean;

  type:
  | "client"
  | "facture"
  | "proforma"
  | "produit"
  | "profil"
  | "auth";

}