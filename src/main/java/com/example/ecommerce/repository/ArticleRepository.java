package com.example.ecommerce.repository;

import com.example.ecommerce.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
}