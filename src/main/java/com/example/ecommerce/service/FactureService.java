package com.example.ecommerce.service;

import com.example.ecommerce.model.Article;
import com.example.ecommerce.model.Facture;
import com.example.ecommerce.repository.ArticleRepository;
import com.example.ecommerce.repository.FactureRepository;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class FactureService {

    private final FactureRepository factureRepository;
    private final ArticleRepository articleRepository;

    public FactureService(FactureRepository factureRepository,
                          ArticleRepository articleRepository) {
        this.factureRepository = factureRepository;
        this.articleRepository = articleRepository;
    }

    public List<Facture> findAll() {
        return factureRepository.findAll();
    }

    public List<Facture>findByfournisseur_Id(Long fournisseurId) {
        return factureRepository.findByfournisseur_Id(fournisseurId);
    }

    public Facture save(Facture facture) {
        if (facture.getArticle() != null && facture.getArticle().getId() != null) {
            Article article = articleRepository.findById(facture.getArticle().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Article not found"));
            facture.setArticle(article);
        }
        facture.recalculateMontantTotal();
        return factureRepository.save(facture);
    }
public Article findarticle(Long id){
        return factureRepository.findarticle(id);
}
    public Number findquantity(Long id){
        return factureRepository.findquantity(id);
    }
    public Number findnumero(Long id){
        return factureRepository.findnumero(id);
    }
    public Object findfournisseur(Long id){
        return factureRepository.findfournisseur(id);
    }
    public void delete(Long id) {

        factureRepository.deleteById(id);
    }
    public Date finddate(Long id){
        return factureRepository.finddate(id);
    }

    public Facture update(Long id, Facture updated) {
        return factureRepository.findById(id)
                .map(existing -> {
                    existing.setNumero(updated.getNumero());
                    existing.setDate(updated.getDate());
                    existing.setFournisseur(updated.getFournisseur());
                    existing.setQuantity(updated.getQuantity());

                    if (updated.getArticle() != null && updated.getArticle().getId() != null) {
                        Article article = articleRepository.findById(updated.getArticle().getId())
                                .orElseThrow(() -> new IllegalArgumentException("Article not found"));
                        existing.setArticle(article);
                    }

                    existing.recalculateMontantTotal();
                    return factureRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Facture not found"));
    }

    public Facture validateFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Facture not found"));
        facture.recalculateMontantTotal();
        return factureRepository.save(facture);
    }
}
