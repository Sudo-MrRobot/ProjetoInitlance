package com.br.initlance.initilance.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.br.initlance.initilance.Security.UsuarioDetails;
import com.br.initlance.initilance.entity.Usuario;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public UserDetails loadUserByUsername(String identificador) throws UsernameNotFoundException {
        Usuario usuario = usuarioService.buscarPorIdentificador(identificador)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado."));

        return new UsuarioDetails(usuario);
    }
}
