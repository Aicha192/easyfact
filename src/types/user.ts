export interface User {
  id: number;

  nom: string;

  email: string;

  telephone: string;

  password: string;

  role: "Admin" | "Utilisateur";
  
  avatar?: string;
}