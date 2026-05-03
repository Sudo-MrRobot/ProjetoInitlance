package com.br.initlance.initilance.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.initlance.initilance.entity.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {

    Optional<Empresa> findByEmail(String email);
}
