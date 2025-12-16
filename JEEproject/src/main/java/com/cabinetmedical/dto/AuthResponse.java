package com.cabinetmedical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String login;
    private String role;
    private Long userId;
    private Long cabinetId;
    private String nom;
    private String prenom;
}


