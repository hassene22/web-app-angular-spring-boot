import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { FactureListComponent } from './components/facture-list/facture-list.component';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { ReactiveFormsModule } from '@angular/forms'; // Add this
import { DatePipe } from '@angular/common';
import { FactureService } from './services/facture.service';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'articles', component: ArticleListComponent },
      { path: '', redirectTo: 'articles', pathMatch: 'full' }
    ]
  },
 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ArticleListComponent,
    FactureListComponent,
    FournisseurListComponent

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [FactureService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }