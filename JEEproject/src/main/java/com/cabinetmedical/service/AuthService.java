package com.cabinetmedical.service;

import com.cabinetmedical.dto.AuthRequest;
import com.cabinetmedical.dto.AuthResponse;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.repository.UtilisateurRepository;
import com.cabinetmedical.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse authenticate(AuthRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new RuntimeException("Login ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getPwd(), utilisateur.getPwd())) {
            throw new RuntimeException("Login ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(
                utilisateur.getLogin(),
                utilisateur.getRole().name(),
                utilisateur.getId(),
                utilisateur.getCabinet() != null ? utilisateur.getCabinet().getId() : null
        );

        return new AuthResponse(
                token,
                utilisateur.getLogin(),
                utilisateur.getRole().name(),
                utilisateur.getId(),
                utilisateur.getCabinet() != null ? utilisateur.getCabinet().getId() : null,
                utilisateur.getNom(),
                utilisateur.getPrenom()
        );
    }
}


