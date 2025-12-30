
package com.cabinetmedical.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cabinetmedical.dto.UpdateProfileRequest;
import com.cabinetmedical.dto.UserMeDto;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.repository.UtilisateurRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UtilisateurRepository utilisateurRepository;

    public UserController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

   @GetMapping("/me")
public ResponseEntity<UserMeDto> me(Authentication auth) {
    String login = auth.getName();
    Utilisateur u = utilisateurRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    UserMeDto dto = new UserMeDto();
    dto.id = u.getId();
    dto.login = u.getLogin();
    dto.nom = u.getNom();
    dto.prenom = u.getPrenom();
    dto.role = u.getRole().name();
    dto.cabinetId = (u.getCabinet() != null) ? u.getCabinet().getId() : null;

    return ResponseEntity.ok(dto);
}
    @PutMapping("/me")
public ResponseEntity<UserMeDto> updateMe(Authentication auth, @RequestBody UpdateProfileRequest req) {
    String login = auth.getName();
    Utilisateur u = utilisateurRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    u.setNom(req.nom);
    u.setPrenom(req.prenom);

    Utilisateur saved = utilisateurRepository.save(u);

    UserMeDto dto = new UserMeDto();
    dto.id = saved.getId();
    dto.login = saved.getLogin();
    dto.nom = saved.getNom();
    dto.prenom = saved.getPrenom();
    dto.role = saved.getRole().name();
    dto.cabinetId = (saved.getCabinet() != null) ? saved.getCabinet().getId() : null;

    return ResponseEntity.ok(dto);
}
}
