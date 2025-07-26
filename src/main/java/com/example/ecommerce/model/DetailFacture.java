package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class DetailFacture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;
    private double montant;

    @ManyToOne
    @JoinColumn(name = "article_id", columnDefinition = "BIGINT UNSIGNED")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "facture_id", columnDefinition = "BIGINT UNSIGNED")
    private Facture facture;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id", columnDefinition = "BIGINT UNSIGNED")
    private fournisseur fournisseur;

    public void setArticleId(Long id) {
        if (id != null && id > 0) {
            this.id = id;
        } else {
            throw new IllegalArgumentException("Article ID must be a positive number");
        }
    }

    public int getPrice() {
        
        return (int) (article.getPrix() * (1 + article.getTva() / 100));}
}