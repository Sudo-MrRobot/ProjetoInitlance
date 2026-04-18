package com.br.initlance.initilance.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import jakarta.persistence.Column;

@Entity
@Data
@Table(name = "freelancers")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Freelancer extends Usuario {
    
    @Column(nullable = false, length = 11, unique = true)
    private String cpf;
}
