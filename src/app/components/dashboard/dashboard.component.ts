import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ArticleService } from '../../services/article.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { FactureService } from '../../services/facture.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Fournisseur } from '../../models/fournisseur.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from '../admin/admin.component';
import { Article } from '../admin/admin.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  factures: any[] = [];
  articles: any[] = [];
  fournisseurs: any[] = [];
  currentFacture: any = { numero: '', date: new Date().toISOString().split('T')[0], article: null, quantity: 0, fournisseur: {}, montantTotal: 0 };
  currentFacture1: Facture = { numero: 0, date: '', article: {
    libelle: '',
    quantity:0
  }, quantity: 0, fournisseur: { nom: '', code: '' }, montantTotal: 0 };
  selectedArticles: any[] = [];
  article:Article={
    libelle: '',
    quantity: 0
  };
  selectedFournisseur: any = null;
  totalAmount = 0;
  quantity1!:number;
  factureId!: number;
    isEditing: boolean = false;
  editingFournisseurId: number | null = null;
   filteredFournisseurs: Observable<Fournisseur[]> | undefined;


  constructor(private http: HttpClient, public authService: AuthService,private articleservice:ArticleService, private fournisseurservice:FournisseurService , private factureservice:FactureService,private fb: FormBuilder, private route: ActivatedRoute) {
 
  
  }

  ngOnInit(): void {
  this.factureId = Number(this.route.snapshot.paramMap.get('id'));

  this.loadArticles();
    this.loadFournisseurs();
   

  if (this.factureId !== 0) {
        this.factureservice.getFactureNumero(this.factureId).subscribe({
      next: (num) => this.currentFacture.numero= num,
      error: (err) => console.error('Failed to load numero', err)
    });

  this.factureservice.getFactureFournisseur(this.factureId).subscribe({
  next: (f) => {
    this.currentFacture.fournisseur = f;
    this.selectedFournisseur = f;
  },
  error: (err) => console.error('Failed to load fournisseur', err)
});

       this.factureservice.getFactureDate(this.factureId).subscribe({
      next: (date) => {
        this.currentFacture.date = date;
      },
      error: (err) => console.error('Failed to load facture date', err)
    });
  
      this.selectedArticles= this.currentFacture.article ;
      this.loadselectedArticles();
      this.loadquantity();
      this.calculateTotal();
      this.selectedFournisseur = this.currentFacture.fournisseur
      this.totalAmount = this.currentFacture.montantTotal ;
     
    }
  
    

   
  }
   




 
 /* getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }*/

   loadArticles(): void {
    this.articleservice.getAllArticles().subscribe(
      (data) => {
        this.articles = data;
        this.calculateTotal();
      },
      (err) => console.error(err)
    );
  }

loadselectedArticles(): void {
    if (this.factureId) {
      this.factureservice.getFactureArticle(this.factureId).subscribe(
        (data) => {
          
          this.selectedArticles =[data];}
        
      )   
      
    }}
    compareFournisseur(f1: any, f2: any): boolean {
  return f1 && f2 ? f1.id === f2.id : f1 === f2;
}

loadquantity(): void {
  if (this.factureId) {
    this.factureservice.getFactureQuantity(this.factureId).subscribe({
      next: (quantity: number) => {
        this.currentFacture.quantity = quantity;

         this.article.quantity = this.currentFacture.quantity;
      
      },
      error: (err) => {
        console.error('Failed to load facture quantity', err);
      }
    });
  }
}

    



  loadFournisseurs(): void {
    this.fournisseurservice.getAllFournisseurs()
      .subscribe({
        next: (data) => this.fournisseurs = data,
        error: (error) => console.error('Error loading fournisseurs:', error)
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
  

  createFacture(): void {
   const details = this.selectedArticles.map(article => ({
    article: article,
    quantity: article.quantity
  }));
    const factureData = {
      numero: this.currentFacture.numero,
      date: this.currentFacture.date,
      fournisseur: this.selectedFournisseur,
      montantTotal: this.currentFacture.montantTotal,
      article: details[0]?.article,   // take first article
    quantity: details[0]?.quantity
    };
    this.currentFacture.numero = this.currentFacture.numero;
this.currentFacture.date = this.currentFacture.date;
this.currentFacture.montantTotal = this.totalAmount;

this.currentFacture.quantity = details[0]?.quantity;
    this.factureservice.create(factureData)
      .subscribe({
        next: () => {
          alert('Facture created successfully');
          
        
        },
        error: (error) => console.error('Error creating facture:', error)
      });
      this.currentFacture.article = factureData.article;
this.currentFacture.fournisseur = this.selectedFournisseur;
  }
updateFacture(): void {
   const details = this.selectedArticles.map(article => ({
    article: article,
    quantity: article.quantity
  }));
    const factureData = {
      id: this.factureId,
      numero: this.currentFacture.numero,
      date: this.currentFacture.date,
      fournisseur: this.selectedFournisseur,
      montantTotal: this.currentFacture.montantTotal,
      article: details[0]?.article,   // take first article
    quantity: details[0]?.quantity
    };
    this.currentFacture.numero = this.currentFacture.numero;
this.currentFacture.date = this.currentFacture.date;
this.currentFacture.montantTotal = this.totalAmount;
this.currentFacture.quantity = details[0]?.quantity;
    this.factureservice.updateFacture(this.factureId, factureData)
      .subscribe({

        next: () => {
        
          alert('Facture updated successfully');


        },        error: (error) => console.error('Error updating facture:', error)
      });
      this.currentFacture.article = factureData.article;
this.currentFacture.fournisseur = this.selectedFournisseur;
  }





  addArticleToFacture(article: any): void {
    const existingArticle = this.selectedArticles.find(a => a.id === article.id);
    if (existingArticle) {
      existingArticle.quantity += 1;
    } else {
      this.selectedArticles.push({...article, quantity: 1});
    }
   
    this.calculateTotal();
  }

  removeArticleFromFacture(article: any): void {
    this.selectedArticles = this.selectedArticles.filter(a => a.id !== article.id);
    this.calculateTotal();
  }

  updateQuantity(article: any, quantity: number): void {
   
    article.quantity = quantity;
   
    
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.selectedArticles.reduce((total, article) => {
      return total + (article.prix * (article.quantity||this.currentFacture.quantity) * (1 + article.tva / 100));
    }, 0);
  }

  validateFacture(): void {
    if (this.selectedArticles.length === 0 || !this.selectedFournisseur) {
      alert('Please select articles and a fournisseur');
      return;
    }
this.currentFacture1.montantTotal = this.totalAmount;

this.currentFacture1.fournisseur = this.selectedFournisseur;
if(this.factureId !== 0){
  this.updateFacture();
  alert('Facture updated successfully');

}else{
    this.createFacture();
    alert('Facture validated successfully');
    
  }
  }
  resetForm(): void {
   
    this.currentFacture = { numero: '', date: new Date().toISOString().split('T')[0] };
    this.selectedArticles = [];
    this.selectedFournisseur = null;
    this.totalAmount = 0;
  }

}