import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs';

interface Fournisseur {
  id?: number;
  code: string;
  nom: string;
  adresse?: string;
  email?: string;
  tel?: string;
  firstName?: string;
  lastName?: string;
}

@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  filteredFournisseurs: Observable<Fournisseur[]> | undefined;
  fournisseurForm: FormGroup;
  isEditing: boolean = false;
  editingFournisseurId: number | null = null;
  

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService
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
    this.loadFournisseurs();
    
    this.filteredFournisseurs = this.fournisseurForm.get('search')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFournisseurs(value || ''))
    );
  }

  loadFournisseurs(): void {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => {
        console.error('Error loading fournisseurs:', err);
        // Optionally, show user-friendly error message
      }
    });
  }

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
  }
}