package com.cabinetmedical.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;

@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();

        // Recommandé : NE PAS forcer le chargement des lazy
        // (sinon risques de lenteurs/N+1)
        module.disable(Hibernate6Module.Feature.FORCE_LAZY_LOADING);

        return module;
    }
}
