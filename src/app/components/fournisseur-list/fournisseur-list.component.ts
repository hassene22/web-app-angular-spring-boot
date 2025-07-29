import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  filteredFournisseurs: Fournisseur[] = [];
  fournisseurForm: FormGroup;
  isEditing: boolean = false;
  editingFournisseurId: number | null = null;
  showDropdown = false;
  highlightedIndex = -1;

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
    
    // Setup search autocomplete
    this.fournisseurForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.fournisseurService.searchFournisseurs(term))
      )
      .subscribe({
        next: (results) => {
          this.filteredFournisseurs = results;
          this.highlightedIndex = -1;
        },
        error: (err) => {
          console.error('Error during search:', err);
          this.filteredFournisseurs = [];
        }
      });
  }

  loadFournisseurs(): void {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => {
        console.error('Error loading fournisseurs:', err);
      }
    });
  }

  onSearchKeyUp(): void {
    const searchTerm = this.fournisseurForm.get('search')?.value;
    if (!searchTerm) {
      this.filteredFournisseurs = [];
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onSearchSubmit(): void {
    const searchTerm = this.fournisseurForm.get('search')?.value;
    if (searchTerm) {
      this.fournisseurService.searchFournisseurs(searchTerm).subscribe({
        next: (data) => {
          this.fournisseurs = data;
          this.showDropdown = false;
        },
        error: (err) => {
          console.error('Error searching fournisseurs:', err);
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
    this.showDropdown = false;
  }

  resetForm(): void {
    this.fournisseurForm.reset();
    this.isEditing = false;
    this.editingFournisseurId = null;
    this.showDropdown = false;
  }
}