package com.br.initlance.initilance.Security;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.br.initlance.initilance.Service.OAuth2ProviderService;
import com.br.initlance.initilance.Service.OAuth2ProviderService.OAuth2UserInfo;
import com.br.initlance.initilance.Service.UsuarioService;
import com.br.initlance.initilance.entity.Usuario;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {

    private static final Logger LOGGER = Logger.getLogger(AuthenticationSuccessHandlerImpl.class.getName());
    private static final String OAUTH_CADASTRO_TIPO = "oauthCadastroTipo";

    private final UsuarioService usuarioService;
    private final OAuth2ProviderService oAuth2ProviderService;

    public AuthenticationSuccessHandlerImpl(UsuarioService usuarioService, OAuth2ProviderService oAuth2ProviderService) {
        this.usuarioService = usuarioService;
        this.oAuth2ProviderService = oAuth2ProviderService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            processarSucessoOAuth(request, response, authentication);
            return;
        }

        String email = authentication.getName();
        Usuario usuario = usuarioService.buscarPorEmail(email).orElse(null);
        String destino = usuario != null ? usuarioService.obterDashboard(usuario) : "/login/cadastrar-como";
        response.sendRedirect(request.getContextPath() + destino);
    }

    private void processarSucessoOAuth(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        HttpSession session = request.getSession(false);
        String tipo = session != null ? (String) session.getAttribute(OAUTH_CADASTRO_TIPO) : null;

        try {
            OAuth2UserInfo oAuth2UserInfo = oAuth2ProviderService.carregarUsuario(authentication);
            Usuario usuarioExistente = usuarioService.buscarUsuarioOAuthExistente(oAuth2UserInfo).orElse(null);

            if (usuarioExistente != null) {
                Usuario usuarioAtualizado = usuarioService.processarLoginOAuth(oAuth2UserInfo, usuarioExistente.getTipo());
                autenticarUsuarioNoContexto(request, authentication, usuarioAtualizado);
                limparTipoCadastro(session);
                response.sendRedirect(request.getContextPath() + usuarioService.obterDashboard(usuarioAtualizado));
                return;
            }

            Usuario usuario = usuarioService.processarLoginOAuth(oAuth2UserInfo, tipo);

            autenticarUsuarioNoContexto(request, authentication, usuario);
            limparTipoCadastro(session);

            response.sendRedirect(request.getContextPath() + usuarioService.obterDashboard(usuario));
        } catch (OAuthAuthenticationException ex) {
            LOGGER.log(Level.WARNING, "Falha controlada no login OAuth: {0}", ex.getMessage());
            limparTipoCadastro(session);
            response.sendRedirect(request.getContextPath() + "/login/cadastrar-como?erro=" + ex.getErrorCode());
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Erro inesperado no callback OAuth", ex);
            limparTipoCadastro(session);
            response.sendRedirect(request.getContextPath() + "/login/cadastrar-como?erro=oauth-interno");
        }
    }

    private void autenticarUsuarioNoContexto(HttpServletRequest request, Authentication authentication, Usuario usuario) {
        UsuarioDetails usuarioDetails = new UsuarioDetails(usuario);
        UsernamePasswordAuthenticationToken novaAutenticacao = new UsernamePasswordAuthenticationToken(
                usuarioDetails,
                authentication.getCredentials(),
                usuarioDetails.getAuthorities());

        novaAutenticacao.setDetails(authentication.getDetails());
        SecurityContextHolder.getContext().setAuthentication(novaAutenticacao);

        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
    }

    private void limparTipoCadastro(HttpSession session) {
        if (session != null) {
            session.removeAttribute(OAUTH_CADASTRO_TIPO);
        }
    }
}
