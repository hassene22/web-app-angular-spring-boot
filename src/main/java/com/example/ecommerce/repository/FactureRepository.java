package com.example.ecommerce.repository;

import com.example.ecommerce.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByfournisseur_Id(Long fournisseur_Id);
    @Query("SELECT COALESCE(MAX(f.numero), 0) FROM Facture f")
    Long findMaxNumero();

}