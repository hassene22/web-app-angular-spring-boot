package com.example.ecommerce.service;

import com.example.ecommerce.model.Article;
import com.example.ecommerce.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> findAll() {
        return articleRepository.findAll();
    }

    public Article findById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    public Article save(Article article) {
        return articleRepository.save(article);
    }

    public Article update(Long id, Article article) {
        Article existingArticle = findById(id);
        existingArticle.setCode(article.getCode());
        existingArticle.setLibelle(article.getLibelle());
        existingArticle.setPrix(article.getPrix());
        existingArticle.setTva(article.getTva());
        return articleRepository.save(existingArticle);
    }

    public void delete(Long id) {
        articleRepository.deleteById(id);
    }
}