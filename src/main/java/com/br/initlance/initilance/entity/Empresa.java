package com.br.initlance.initilance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;


@Entity
@Data
@Table(name = "empresas", schema= "public")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)

public class Empresa extends Usuario {
    
    @Column(length = 20, unique=true)
    private String cnpj;
}
