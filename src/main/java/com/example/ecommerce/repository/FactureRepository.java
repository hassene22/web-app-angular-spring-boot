package com.example.ecommerce.repository;

import com.example.ecommerce.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.ecommerce.model.Article;
import java.util.List;
import java.util.Date;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findAll();
    @Query("SELECT f.article FROM Facture f WHERE f.id = :id")
    Article findarticle(Long id);
    @Query("SELECT f.quantity FROM Facture f WHERE f.id = :id")
    Number findquantity(Long id);
    List<Facture> findByarticle_Id(Long article_Id);
    List<Facture> findByfournisseur_Id(Long fournisseur_Id);
    @Query("SELECT f.numero FROM Facture f WHERE f.id = :id")
    Number findnumero(Long id);
              
    @Query("SELECT f.fournisseur FROM Facture f WHERE f.id = :id")
    Object  findfournisseur(Long id);
    @Query("SELECT f.date FROM Facture f WHERE f.id = :id")
    Date finddate(Long id);
      
}