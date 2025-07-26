package com.example.ecommerce.service;

import com.example.ecommerce.model.fournisseur;
import com.example.ecommerce.repository.FournisseurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FournisseurService {
    private final FournisseurRepository repository;

    public FournisseurService(FournisseurRepository repository) {
        this.repository = repository;
    }

    public List<fournisseur> getAllFournisseurs() {
        return repository.findAll();
    }

    public fournisseur getFournisseurById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Fournisseur not found"));
    }

    public fournisseur saveFournisseur( fournisseur fournisseur) {
        return repository.save(fournisseur);
    }

    public void deleteFournisseur(Long id) {
        repository.deleteById(id);
    }

}