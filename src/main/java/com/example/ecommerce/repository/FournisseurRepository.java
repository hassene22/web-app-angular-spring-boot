package com.example.ecommerce.repository;

import com.example.ecommerce.model.fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FournisseurRepository extends JpaRepository< fournisseur, Long> {
    
   
}