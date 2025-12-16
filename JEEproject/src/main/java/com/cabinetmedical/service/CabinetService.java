package com.cabinetmedical.service;

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
        utilisateur.setPwd(passwordEncoder.encode(utilisateur.getPwd()));
        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> getUtilisateursByCabinet(Long cabinetId) {
        return utilisateurRepository.findByCabinetId(cabinetId);
    }
}


