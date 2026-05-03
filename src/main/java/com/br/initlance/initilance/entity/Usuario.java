package com.br.initlance.initilance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "usuarios", schema = "public")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "email", nullable = true, length = 100, unique = true)
    private String email;

    @Column(name = "senha", nullable = true, length = 100)
    private String senha;

    @Column(nullable = false)
    private String tipo;

    @Column(name = "oauth", nullable = false, columnDefinition = "boolean default false")
    private Boolean oauth = Boolean.FALSE;

    @Column(name = "github_id", unique = true)
    private Long githubId;

    @Column(name = "google_id", length = 255, unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 20)
    private AuthProvider provider = AuthProvider.LOCAL;
}
