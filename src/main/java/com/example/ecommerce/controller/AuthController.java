package com.example.ecommerce.controller;

import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already taken!"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

  @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User user) {
    User existingUser = userRepository.findByEmail(user.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
    }

   return ResponseEntity.ok(Map.of(
    "id", existingUser.getId(),
    "email", existingUser.getEmail(),
    "role", existingUser.getrole(),
    "message", "Login successful"
));
}

    @GetMapping("/{id}")
    public ResponseEntity<String> getrole(@PathVariable Long id) {
        User user = userRepository.findUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.getrole());
    }
}