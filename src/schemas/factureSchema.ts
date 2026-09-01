import { z } from 'zod';

export const factureSchema = z.object({
  client: z.string().min(1, 'Veuillez sélectionner un client.'),

  numero: z.string().min(1, 'Le numéro de facture est obligatoire.'),

  dateEmission: z.string().min(1, "La date d'émission est obligatoire."),

  dateEcheance: z.string().min(1, "La date d'échéance est obligatoire."),

  tva: z
    .number()
    .min(0, 'La TVA ne peut pas être négative.')
    .max(100, 'La TVA ne peut pas dépasser 100.'),

  statut: z.enum(['Brouillon', 'Envoyée', 'Payée', 'En retard']),

  notes: z.string().optional(),
});

export type FactureFormSchema = z.infer<typeof factureSchema>;
