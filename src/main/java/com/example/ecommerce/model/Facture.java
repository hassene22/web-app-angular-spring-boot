package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @Column(unique = true, nullable = false, columnDefinition = "BIGINT UNSIGNED")
    private long numero;

    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id", columnDefinition = "BIGINT UNSIGNED")
    private fournisseur fournisseur;


    private int quantity;
    private double montant;

    @ManyToOne
    @JoinColumn(name = "article_id", columnDefinition = "BIGINT UNSIGNED")
    private Article article;

    // --------------------------
    // Computed montantTotal
    // --------------------------
    private double montantTotal;

    public void recalculateMontantTotal() {
        if (article != null && quantity > 0) {
            this.montant = article.getPrix() * quantity;
            this.montantTotal = this.montant; // here one line = total
        } else {
            this.montant = 0;
            this.montantTotal = 0;
        }
    }

    public int getPrice() {
        if (article == null) return 0;
        return (int) (article.getPrix() * (1 + article.getTva() / 100));
    }
}
