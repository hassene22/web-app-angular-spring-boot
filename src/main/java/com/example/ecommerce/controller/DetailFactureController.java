package com.example.ecommerce.controller;

import com.example.ecommerce.model.Article;
import com.example.ecommerce.model.DetailFacture;
import com.example.ecommerce.repository.ArticleRepository;
import com.example.ecommerce.repository.DetailFactureRepository;
import com.example.ecommerce.repository.FactureRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/details")
public class DetailFactureController {

    private final DetailFactureRepository detailFactureRepository;
    private final FactureRepository factureRepository;
    private final ArticleRepository articleRepository;

    public DetailFactureController(DetailFactureRepository detailFactureRepository,
                                 FactureRepository factureRepository,
                                 ArticleRepository articleRepository) {
        this.detailFactureRepository = detailFactureRepository;
        this.factureRepository = factureRepository;
        this.articleRepository = articleRepository;
    }

    @GetMapping("/facture/{factureId}")
    public List<DetailFacture> getDetailsByFacture(@PathVariable Long factureId) {
        return detailFactureRepository.findByFacture_Id(factureId);
    }

    @PostMapping
    public ResponseEntity<DetailFacture> createDetail(@RequestBody DetailFacture detail) {
        if (detail.getFacture() == null || detail.getFacture().getId() == null ||
            detail.getArticle() == null || detail.getArticle().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!factureRepository.existsById(detail.getFacture().getId()) ||
            !articleRepository.existsById(detail.getArticle().getId())) {
            return ResponseEntity.notFound().build();
        }

        // Calculate amount based on article price and quantity
        Article article = articleRepository.findById(detail.getArticle().getId()).orElseThrow();
        detail.setMontant(article.getPrix() * detail.getQuantity());

        DetailFacture savedDetail = detailFactureRepository.save(detail);
        return ResponseEntity.ok(savedDetail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetailFacture> updateDetail(@PathVariable Long id, @RequestBody DetailFacture detail) {
        return detailFactureRepository.findById(id)
                .map(existingDetail -> {
                    existingDetail.setQuantity(detail.getQuantity());
                    
                    // Recalculate amount if quantity changes
                    Article article = articleRepository.findById(existingDetail.getArticle().getId()).orElseThrow();
                    existingDetail.setMontant(article.getPrix() * detail.getQuantity());
                    
                    DetailFacture updatedDetail = detailFactureRepository.save(existingDetail);
                    return ResponseEntity.ok(updatedDetail);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDetail(@PathVariable Long id) {
        return detailFactureRepository.findById(id)
                .map(detail -> {
                    detailFactureRepository.delete(detail);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
