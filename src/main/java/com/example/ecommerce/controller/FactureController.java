package com.example.ecommerce.controller;

import com.example.ecommerce.model.Facture;
import com.example.ecommerce.service.FactureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ecommerce.model.Article;
import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    @GetMapping
    public ResponseEntity<List<Facture>> getAll() {
        return ResponseEntity.ok(factureService.findAll());
    }

    @GetMapping("/fournisseur/{fournisseurId}")
    public ResponseEntity<List<Facture>> getByFournisseur(@PathVariable Long fournisseurId) {
        return ResponseEntity.ok(factureService.findByfournisseur_Id(fournisseurId));
    }
    @GetMapping("/article/{id}")
    public ResponseEntity<Article> getfacturearticle(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findarticle(id));
    }
    @GetMapping("/quantity/{id}")
    public ResponseEntity<Number> getfacturequantity(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findquantity(id));
    }
   @GetMapping("/numero/{id}")

    public ResponseEntity<Number> getfacturenumero(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findnumero(id));
    }
    @GetMapping("/fournisseurobj/{id}")
    public ResponseEntity<Object> getfacturefournisseur(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findfournisseur(id));
    }

    @GetMapping("/date/{id}")
    public ResponseEntity<java.util.Date> getfacturedate(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.finddate(id));
    }
    @PostMapping
    public ResponseEntity<Facture> create(@RequestBody Facture facture) {
        return ResponseEntity.ok(factureService.save(facture));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> update(@PathVariable Long id, @RequestBody Facture facture) {
        return ResponseEntity.ok(factureService.update(id, facture));
    }
    

    @PostMapping("/{id}/validate")
    public ResponseEntity<Facture> validateFacture(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.validateFacture(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
