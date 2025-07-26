package com.example.ecommerce.repository;

import com.example.ecommerce.model.DetailFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetailFactureRepository extends JpaRepository<DetailFacture, Long> {
    List<DetailFacture> findByFacture_Id(Long factureId);
}