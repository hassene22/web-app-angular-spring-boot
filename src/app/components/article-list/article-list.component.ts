import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  newArticle: any = {};
  editingArticle: any = null;
  totalAmount: number = 0;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(
      (data) => {
        this.articles = data;
        this.calculateTotal();
      },
      (err) => console.error(err)
    );
  }

  createArticle(): void {
    this.articleService.createArticle(this.newArticle).subscribe(
      () => {
        this.loadArticles();
        this.newArticle = {};
      },
      (err) => console.error(err)
    );
  }

  editArticle(article: any): void {
    this.editingArticle = { ...article };
  }

  updateArticle(): void {
    this.articleService.updateArticle(this.editingArticle.id, this.editingArticle).subscribe(
      () => {
        this.loadArticles();
        this.editingArticle = null;
      },
      (err) => console.error(err)
    );
  }

  deleteArticle(id: number): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(id).subscribe(
        () => this.loadArticles(),
        (err) => console.error(err)
      );
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.articles.reduce((sum, article) => sum + (article.prix * (article.quantity || 1)), 0);
  }

  onQuantityChange(): void {
    this.calculateTotal();
  }
}
