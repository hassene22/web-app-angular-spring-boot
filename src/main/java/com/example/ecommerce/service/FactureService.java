package com.example.ecommerce.service;
import com.example.ecommerce.model.DetailFacture;
import com.example.ecommerce.model.Facture;
import com.example.ecommerce.repository.FactureRepository;
import org.springframework.stereotype.Service;
import com.example.ecommerce.model.fournisseur;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FactureService {

    private final FactureRepository factureRepository;

    public FactureService(FactureRepository factureRepository) {
        this.factureRepository = factureRepository;
    }

    public List<Facture> findAll() {
        return factureRepository.findAll();
    }

    public List<Facture> findByfournisseurId(Long fournisseur_Id) {
        return factureRepository.findByfournisseur_Id(fournisseur_Id);
    }

    public Facture save(Facture facture) {
        return factureRepository.save(facture);
    }

    public Facture validateFacture(Facture facture) {
        // Calculate total amount
        double total = facture.getDetails().stream()
                .mapToDouble(detail -> detail.getArticle().getPrix() * detail.getQuantity())
                .sum();
        
        facture.setMontantTotal(total);
        return factureRepository.save(facture);
    }

    public void delete(Long id) {
        factureRepository.deleteById(id);
    }
      @Transactional
    public Facture createFacture(fournisseur fournisseur, List<DetailFacture> details) {
        Facture facture = new Facture();
        facture.setNumero(generateNextNumero());
        facture.setFournisseur(fournisseur);
        facture.setDetails(details);
        facture.setMontantTotal(0.0); // Will be calculated by setMontantTotal
        if (details != null) {
            details.forEach(detail -> detail.setFacture(facture));
            facture.setMontantTotal(0.0); // Trigger calculation
        }
        return factureRepository.save(facture);
    }

    private synchronized long generateNextNumero() {
        Long maxNumero = factureRepository.findMaxNumero();
        return maxNumero == null ? 1 : maxNumero + 1;
    }

}