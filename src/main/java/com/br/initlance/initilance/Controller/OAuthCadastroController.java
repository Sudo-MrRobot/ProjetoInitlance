package com.br.initlance.initilance.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import jakarta.servlet.http.HttpSession;

@Controller
public class OAuthCadastroController {

    private static final String OAUTH_CADASTRO_TIPO = "oauthCadastroTipo";
    private static final String GITHUB = "github";
    private static final String GOOGLE = "google";

    @GetMapping("/oauth2/authorize/{provider}")
    public String autorizarLogin(@PathVariable String provider, HttpSession session) {
        validarProvider(provider);
        session.removeAttribute(OAUTH_CADASTRO_TIPO);
        return "redirect:/oauth2/authorization/" + provider;
    }

    @GetMapping("/oauth2/authorize/{provider}/{tipo}")
    public String autorizarCadastro(@PathVariable String provider, @PathVariable String tipo, HttpSession session) {
        validarProvider(provider);
        session.setAttribute(OAUTH_CADASTRO_TIPO, tipo);
        return "redirect:/oauth2/authorization/" + provider;
    }

    private void validarProvider(String provider) {
        if (!GITHUB.equals(provider) && !GOOGLE.equals(provider)) {
            throw new IllegalArgumentException("Provider OAuth2 invalido.");
        }
    }
}
