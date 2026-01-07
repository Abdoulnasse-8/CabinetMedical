package com.cabinetmedical.dto;

import com.cabinetmedical.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String login;
    private String nom;
    private String prenom;
    private String numTel;
    private String signature;
    private Role role;
    private Long cabinetId;
}

