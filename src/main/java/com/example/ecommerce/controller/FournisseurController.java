package com.example.ecommerce.controller;

import com.example.ecommerce.model.fournisseur;
import com.example.ecommerce.service.FournisseurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {
    private final FournisseurService service;

    public FournisseurController(FournisseurService service) {
        this.service = service;
    }

    @GetMapping
    public List<fournisseur> getAllFournisseurs() {
        return service.getAllFournisseurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<fournisseur> getFournisseurById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getFournisseurById(id));
    }

    @PostMapping
    public fournisseur createFournisseur(@RequestBody fournisseur fournisseur) {
        return service.saveFournisseur(fournisseur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<fournisseur> updateFournisseur(@PathVariable Long id, @RequestBody fournisseur fournisseur) {
        return ResponseEntity.ok(service.saveFournisseur(fournisseur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Long id) {
        service.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }
}