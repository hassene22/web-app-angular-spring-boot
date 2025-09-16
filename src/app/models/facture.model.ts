import { Article } from './article.model';
import { Fournisseur } from './fournisseur.model';
import { User } from './user.model';

export interface Facture {
  id: number;
  numero?: number;
  date: Date;
  fournisseurid: number;
  montantTotal?: number;
  details?: FactureDetail[];
}

export interface FactureDetail {
  id: number;
  quantity: number;
  montant: number;
  article: Article;
}