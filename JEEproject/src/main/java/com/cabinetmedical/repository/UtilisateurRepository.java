package com.cabinetmedical.repository;

import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByLogin(String login);
    List<Utilisateur> findByCabinetId(Long cabinetId);
    List<Utilisateur> findByRole(Role role);
    List<Utilisateur> findByCabinetIdAndRole(Long cabinetId, Role role);
}


