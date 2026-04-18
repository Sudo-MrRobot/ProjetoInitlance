package com.br.initlance.initilance.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.initlance.initilance.Repository.UsuarioRepository;
import com.br.initlance.initilance.entity.Usuario;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

        public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
        }
        public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    
}
