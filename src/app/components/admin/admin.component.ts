import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs';

import { FactureService  } from '../../services/facture.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { Fournisseur } from '../../models/fournisseur.model';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';
export interface Article {
  quantity: any;
  id?: number;
  libelle: string;
  prix?: number;
}

export interface Facture {
  id?: number;
  numero: number;
  date: string;
  quantity: number;
  montant?: number;
  montantTotal?: number;
  fournisseur: Fournisseur;
  article: Article;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [DatePipe]
})
export class AdminComponent {
  fournisseurs: Fournisseur[] = [];
  filteredFournisseurs: Observable<Fournisseur[]> | undefined;
  fournisseurForm!: FormGroup;
  selectedFacture?: Facture;
   selectedArticles: Article[] = [];
 factures: Facture[] = [];
  isEditing: boolean = false;
  editingFournisseurId: number | null = null;
  apiUrl = 'http://localhost:8080/api/factures';
   // Form model
  factureForm: Facture = {
    numero: 0,
    date: '',
    quantity: 0,
    id: 0,
    article: {
      libelle: '',
      quantity: 0
    },
    fournisseur: {
       nom: '',
      code: ''
    },
    montant: 0,
    montantTotal: 0
  };
    isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private factureService: FactureService,
    private datePipe: DatePipe,
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  
  ) {
    this.fournisseurForm = this.fb.group({
      search: [''],
      code: ['', Validators.required],
      nom: ['', Validators.required],
      adresse: [''],
      email: ['', Validators.email],
      tel: [''],
      firstName: [''],
      lastName: ['']
    });
  }
    ngOnInit(): void {
   this.loadFactures();
    this.loadFournisseurs();
    this.filteredFournisseurs = this.fournisseurForm.get('search')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFournisseurs(value || ''))
    );
  }
  
  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => {
        console.error('Error loading fournisseurs:', err);
        // Optionally, show user-friendly error message
      }
    });
  }
     loadFactures() {
    this.http.get<Facture[]>(this.apiUrl).subscribe((data) => {
      this.factures = data;
    });
  }
   deleteFacture(id: number) {
    if (confirm('Are you sure you want to delete this facture?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadFactures();
      });
    }
  }
   saveFacture() {
    if (this.isEditMode && this.factureForm.id) {
      this.http.put<Facture>(`${this.apiUrl}/${this.factureForm.id}`, this.factureForm).subscribe(() => {
        alert('Facture updated successfully');
        this.resetForm();
        this.loadFactures();
      });
    } else {
      this.http.post<Facture>(this.apiUrl, this.factureForm).subscribe(() => {
        alert('Facture created successfully');
        this.resetForm();
        this.loadFactures();
      });
    }
  }
    editFacture(facture: Facture) {
    this.factureForm = { ...facture };
    this.isEditMode = true;
  }
    updateFacture(facture: Facture) {
    this.http.put<Facture>(`${this.apiUrl}/${facture.id}`, facture).subscribe(() => {
      alert('Facture updated successfully');
      this.loadFactures();
    });
  }
  createFacture(newFacture: Facture) {
    this.http.post<Facture>(this.apiUrl, newFacture).subscribe(() => {
      this.loadFactures();
    });
  }
 validateFacture(id: number) {
    this.http.post<Facture>(`${this.apiUrl}/${id}/validate`, {}).subscribe(() => {
      alert('Facture validated successfully');
      this.loadFactures();
    });
  }

 printFacture(facture: Facture) {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write('<h1>Facture</h1>');
      printWindow.document.write(`<p><b>Numero:</b> ${facture.numero}</p>`);
      printWindow.document.write(`<p><b>Date:</b> ${facture.date}</p>`);
      printWindow.document.write(`<p><b>Fournisseur:</b> ${facture.fournisseur?.nom}</p>`);
      printWindow.document.write(`<p><b>Article:</b> ${facture.article?.libelle}</p>`);
      printWindow.document.write(`<p><b>Quantité:</b> ${facture.quantity}</p>`);
      printWindow.document.write(`<p><b>Montant Total:</b> ${facture.montantTotal}</p>`);
      printWindow.document.close();
      printWindow.print();
    }
  }
   
 goToFacture(id: number) {
    this.router.navigate(['/dashboard', id]);
  }
  

  futureDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        return { pastDate: true };
      }
      return null;
    };
  }
  /* editFacture(facture: any): void {
    // Assuming facture has the necessary properties
    this.factureForm.patchValue({
      numero: facture.numero,
      date: this.datePipe.transform(facture.date, 'yyyy-MM-dd')
    });
    // Optionally, you might want to update the facture instead of creating a new one
    this.factureService.updateFacture(facture.id, this.factureForm.value).subscribe(
      () => this.loadFactures(),
      (err) => console.error(err)
    );
  }*/
  
  

  private _filterFournisseurs(value: string): Fournisseur[] {
    const filterValue = value.toLowerCase();
    return this.fournisseurs.filter(f => 
      f.nom.toLowerCase().includes(filterValue) || 
      f.code.toLowerCase().includes(filterValue)
    );
  }

 onSearchSubmit(): void {
    const searchTerm = this.fournisseurForm.get('search')!.value;
    if (searchTerm) {
      this.fournisseurService.searchFournisseurs(searchTerm).subscribe({
        next: (data) => {
          this.fournisseurs = data;
          // Display names of fournisseurs
          console.log('Fournisseur names:', data.map((fournisseur: { nom: any; }) => fournisseur.nom));
        },
        error: (err) => {
          console.error('Error searching fournisseurs:', err);
          // Optionally, show user-friendly error message
        }
      });
    } else {
      this.loadFournisseurs();
    }
  }

  onFournisseurSubmit(): void {
    if (this.fournisseurForm.valid) {
      const formValue = {
        code: this.fournisseurForm.get('code')!.value,
        nom: this.fournisseurForm.get('nom')!.value,
        adresse: this.fournisseurForm.get('adresse')!.value,
        email: this.fournisseurForm.get('email')!.value,
        tel: this.fournisseurForm.get('tel')!.value,
        firstName: this.fournisseurForm.get('firstName')!.value,
        lastName: this.fournisseurForm.get('lastName')!.value
      };

      if (this.isEditing && this.editingFournisseurId) {
        this.fournisseurService.updateFournisseur(this.editingFournisseurId, formValue).subscribe({
          next: () => {
            this.loadFournisseurs();
            this.resetForm();
          },
          error: (err) => {
            console.error('Error updating fournisseur:', err);
          }
        });
      } else {
        this.fournisseurService.createFournisseur(formValue).subscribe({
          next: () => {
            this.loadFournisseurs();
            this.resetForm();
          },
          error: (err) => {
            console.error('Error creating fournisseur:', err);
          }
        });
      }
    }
  }

  editFournisseur(fournisseur: Fournisseur): void {
    this.selectFournisseur(fournisseur);
  }

  deleteFournisseur(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this fournisseur?')) {
      this.fournisseurService.deleteFournisseur(id).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error deleting fournisseur:', err);
        }
      });
    }
  }

  selectFournisseur(fournisseur: Fournisseur): void {
    this.isEditing = true;
    this.editingFournisseurId = fournisseur.id || null;
    this.fournisseurForm.patchValue({
      search: fournisseur.nom,
      code: fournisseur.code,
      nom: fournisseur.nom,
      adresse: fournisseur.adresse || '',
      email: fournisseur.email || '',
      tel: fournisseur.tel || '',
      firstName: fournisseur.firstName || '',
      lastName: fournisseur.lastName || ''
    });
  }

  resetForm(): void {
    this.fournisseurForm.reset();
    this.isEditing = false;
    this.editingFournisseurId = null;
     this.factureForm =  {
    numero: 0,
    date: '',
    quantity: 0,
    id: 0,
    article: {
      id: 0, libelle: '', prix: 0,
      quantity: 0
    },
    fournisseur: {
      nom: '',
      code: ''
    },

    montant: 0,
    montantTotal: 0
  };
    this.isEditMode = false;
  }
}


