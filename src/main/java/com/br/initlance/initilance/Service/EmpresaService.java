package com.br.initlance.initilance.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.initlance.initilance.Repository.EmpresaRepository;
import com.br.initlance.initilance.entity.Empresa;

@Service
public class EmpresaService {
    
    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa salvar(Empresa empresa) {
        return empresaRepository.save(empresa);
    }
}
