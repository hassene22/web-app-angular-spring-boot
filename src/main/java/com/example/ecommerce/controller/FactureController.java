package com.example.ecommerce.controller;

import com.example.ecommerce.model.Facture;
import com.example.ecommerce.service.FactureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    @GetMapping
    public ResponseEntity<List<Facture>> getAllFactures() {
        return ResponseEntity.ok(factureService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Facture>> getFacturesByUser(@PathVariable Long fournisseurId) {
        return ResponseEntity.ok(factureService.findByfournisseurId(fournisseurId));
    }

    @PostMapping
    public ResponseEntity<Facture> createFacture(@RequestBody Facture facture) {
        return ResponseEntity.ok(factureService.save(facture));
    }

    @PostMapping("/validate")
    public ResponseEntity<Facture> validateFacture(@RequestBody Facture facture) {
        return ResponseEntity.ok(factureService.validateFacture(facture));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}