package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Entity
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT UNSIGNED")
    private Long id;
     @Column(unique = true, nullable = false, columnDefinition = "BIGINT UNSIGNED")
    private long numero;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id", columnDefinition = "BIGINT UNSIGNED")
    private fournisseur fournisseur;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL)
    private List<DetailFacture> details;
    private double montantTotal;

    public void setMontantTotal(double total) {
        if (details != null) {
        total = details.stream()
                .mapToDouble(detail -> detail.getPrice() * detail.getQuantity())
                .sum();
    }
    this.montantTotal = total;
        
    }
}