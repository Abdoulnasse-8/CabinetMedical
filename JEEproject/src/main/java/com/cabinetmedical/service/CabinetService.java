package com.cabinetmedical.service;

import com.cabinetmedical.dto.UserDto;
import com.cabinetmedical.entity.Cabinet;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.enums.Role;
import com.cabinetmedical.repository.CabinetRepository;
import com.cabinetmedical.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CabinetService {

    @Autowired
    private CabinetRepository cabinetRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Cabinet> getAllCabinets() {
        return cabinetRepository.findAll();
    }

    public List<Cabinet> getActiveCabinets() {
        return cabinetRepository.findByActifTrue();
    }

    public Cabinet getCabinetById(Long id) {
        return cabinetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));
    }

    @Transactional
    public Cabinet createCabinet(Cabinet cabinet) {
        return cabinetRepository.save(cabinet);
    }

    public Cabinet updateCabinet(Long id, Cabinet cabinetDetails) {
        Cabinet cabinet = getCabinetById(id);
        cabinet.setNom(cabinetDetails.getNom());
        cabinet.setSpecialite(cabinetDetails.getSpecialite());
        cabinet.setAdresse(cabinetDetails.getAdresse());
        cabinet.setTel(cabinetDetails.getTel());
        cabinet.setLogo(cabinetDetails.getLogo());
        return cabinetRepository.save(cabinet);
    }

    public Cabinet toggleCabinetStatus(Long id) {
        Cabinet cabinet = getCabinetById(id);
        cabinet.setActif(!cabinet.getActif());
        return cabinetRepository.save(cabinet);
    }

    public void deleteCabinet(Long id) {
        cabinetRepository.deleteById(id);
    }

    @Transactional
    public Utilisateur createUtilisateurForCabinet(Long cabinetId, Utilisateur utilisateur) {
        Cabinet cabinet = getCabinetById(cabinetId);
        utilisateur.setCabinet(cabinet);

        // Validation : le mot de passe ne peut pas être null ou vide
        String rawPassword = utilisateur.getPwd();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe est obligatoire");
        }

        utilisateur.setPwd(passwordEncoder.encode(rawPassword));
        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> getUtilisateursByCabinet(Long cabinetId) {
        return utilisateurRepository.findByCabinetId(cabinetId);
    }

    public List<UserDto> getUtilisateursByCabinetAsDto(Long cabinetId) {
        return utilisateurRepository.findByCabinetId(cabinetId).stream()
                .map(u -> {
                    UserDto dto = new UserDto();
                    dto.setId(u.getId());
                    dto.setLogin(u.getLogin());
                    dto.setNom(u.getNom());
                    dto.setPrenom(u.getPrenom());
                    dto.setNumTel(u.getNumTel());
                    dto.setSignature(u.getSignature());
                    dto.setRole(u.getRole());
                    dto.setCabinetId(u.getCabinet() != null ? u.getCabinet().getId() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Utilisateur updateUtilisateur(Long cabinetId, Long userId, Utilisateur utilisateurDetails) {
        Cabinet cabinet = getCabinetById(cabinetId);
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier que l'utilisateur appartient au cabinet
        if (!utilisateur.getCabinet().getId().equals(cabinetId)) {
            throw new RuntimeException("L'utilisateur n'appartient pas à ce cabinet");
        }

        utilisateur.setNom(utilisateurDetails.getNom());
        utilisateur.setPrenom(utilisateurDetails.getPrenom());
        utilisateur.setNumTel(utilisateurDetails.getNumTel());
        utilisateur.setRole(utilisateurDetails.getRole());
        utilisateur.setSignature(utilisateurDetails.getSignature());

        // Mettre à jour le mot de passe seulement s'il est fourni
        if (utilisateurDetails.getPwd() != null && !utilisateurDetails.getPwd().isEmpty()) {
            utilisateur.setPwd(passwordEncoder.encode(utilisateurDetails.getPwd()));
        }

        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Ne pas permettre la suppression si c'est le dernier admin du cabinet
        if (utilisateur.getRole() == Role.ADMINISTRATEUR) {
            List<Utilisateur> admins = utilisateurRepository.findByCabinetIdAndRole(
                utilisateur.getCabinet().getId(), Role.ADMINISTRATEUR);
            if (admins.size() <= 1) {
                throw new RuntimeException("Impossible de supprimer le dernier administrateur du cabinet");
            }
        }

        utilisateurRepository.deleteById(userId);
    }
}


