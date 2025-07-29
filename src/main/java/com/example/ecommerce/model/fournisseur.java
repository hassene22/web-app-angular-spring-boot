package com.example.ecommerce.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "fournisseurs")
public class fournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT UNSIGNED", nullable = false, unique = true)
    private Long id;

    private String code;
    private String nom;
    private String adresse;
    private String email;
    private String tel;
    private String firstName;
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;
}