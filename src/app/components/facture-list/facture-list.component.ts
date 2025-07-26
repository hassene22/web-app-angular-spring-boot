import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from '../../services/facture.service';
import { DatePipe } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css'],
  providers: [DatePipe]
})
export class FactureListComponent implements OnInit {
  factures: any[] = [];
  factureForm: FormGroup;
  nextNumero: number = 1;

  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private datePipe: DatePipe
  ) {
    this.factureForm = this.fb.group({
      numero: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator()]]
    });
  }

  ngOnInit(): void {
    this.loadFactures();
    this.initializeNextNumero();
  }

  loadFactures(): void {
    this.factureService.getFactures().subscribe(
      (data) => {
        this.factures = data;
        this.initializeNextNumero();
      },
      (err) => console.error(err)
    );
  }

  initializeNextNumero(): void {
    if (this.factures.length > 0) {
      const maxNumero = Math.max(...this.factures.map(f => f.numero));
      this.nextNumero = maxNumero + 1;
    } else {
      this.nextNumero = 1;
    }
    this.factureForm.patchValue({ numero: this.nextNumero });
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
  editFacture(facture: any): void {
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
  }
  deleteFacture(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe(
        () => this.loadFactures(),
        (err) => console.error(err)
      );
    }
  }
 


  onSubmit(): void {
    if (this.factureForm.valid) {
      const formValue = this.factureForm.value;
      const factureData = {
        numero: formValue.numero,
        date: this.datePipe.transform(formValue.date, 'yyyy-MM-dd')
      };

      this.factureService.createFacture(factureData).subscribe(
        () => {
          this.loadFactures();
          this.factureForm.reset();
          this.factureForm.patchValue({ numero: this.nextNumero });
        },
        (err) => console.error(err)
      );
    }
  }
}