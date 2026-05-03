package com.br.initlance.initilance.Service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.br.initlance.initilance.Repository.EmpresaRepository;
import com.br.initlance.initilance.Repository.FreelancerRepository;
import com.br.initlance.initilance.Repository.UsuarioRepository;
import com.br.initlance.initilance.Security.OAuthAuthenticationException;
import com.br.initlance.initilance.Service.OAuth2ProviderService.OAuth2UserInfo;
import com.br.initlance.initilance.entity.AuthProvider;
import com.br.initlance.initilance.entity.Empresa;
import com.br.initlance.initilance.entity.Freelancer;
import com.br.initlance.initilance.entity.Usuario;

@Service
public class UsuarioService {

    private static final String GITHUB_EMAIL_DOMAIN = "@github.local";
    private static final String GOOGLE_EMAIL_DOMAIN = "@google.local";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Freelancer cadastrarFreelancer(Freelancer freelancer) {
        validarCadastroLocal(freelancer);
        freelancer.setTipo("freelancer");
        freelancer.setOauth(Boolean.FALSE);
        freelancer.setProvider(AuthProvider.LOCAL);
        freelancer.setEmail(normalizarEmail(freelancer.getEmail()));

        validarEmailDisponivel(freelancer.getEmail(), freelancer.getIdUsuario());
        prepararSenha(freelancer);

        return freelancerRepository.save(freelancer);
    }

    @Transactional
    public Empresa cadastrarEmpresa(Empresa empresa) {
        validarCadastroLocal(empresa);
        empresa.setTipo("empresa");
        empresa.setOauth(Boolean.FALSE);
        empresa.setProvider(AuthProvider.LOCAL);
        empresa.setEmail(normalizarEmail(empresa.getEmail()));

        validarEmailDisponivel(empresa.getEmail(), empresa.getIdUsuario());
        prepararSenha(empresa);

        return empresaRepository.save(empresa);
    }

    @Transactional
    public Usuario processarLoginOAuth(OAuth2UserInfo oAuth2UserInfo, String tipo) {
        if (oAuth2UserInfo == null) {
            throw new OAuthAuthenticationException("oauth-dados", "Dados do provedor OAuth nao informados.");
        }

        try {
            Optional<Usuario> usuarioExistente = buscarUsuarioOAuth(oAuth2UserInfo);
            if (usuarioExistente.isPresent()) {
                return atualizarDadosOAuth(usuarioExistente.get(), oAuth2UserInfo);
            }

            return criarUsuarioOAuth(oAuth2UserInfo, resolverTipoCadastro(tipo));
        } catch (IllegalArgumentException ex) {
            throw new OAuthAuthenticationException("email-duplicado", ex.getMessage());
        }
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return Optional.empty();
        }

        return usuarioRepository.findByEmailIgnoreCase(normalizarEmail(email));
    }

    public Optional<Usuario> buscarPorGithubId(Long githubId) {
        return usuarioRepository.findByGithubId(githubId);
    }

    public Optional<Usuario> buscarPorGoogleId(String googleId) {
        if (!StringUtils.hasText(googleId)) {
            return Optional.empty();
        }

        return usuarioRepository.findByGoogleId(googleId.trim());
    }

    public Optional<Usuario> buscarUsuarioOAuthExistente(OAuth2UserInfo oAuth2UserInfo) {
        return buscarUsuarioOAuth(oAuth2UserInfo);
    }

    public Optional<Usuario> buscarPorIdentificador(String identificador) {
        Optional<Usuario> usuarioPorEmail = buscarPorEmail(identificador);
        if (usuarioPorEmail.isPresent()) {
            return usuarioPorEmail;
        }

        Optional<Usuario> usuarioPorGoogleId = buscarPorGoogleId(identificador);
        if (usuarioPorGoogleId.isPresent()) {
            return usuarioPorGoogleId;
        }

        if (!StringUtils.hasText(identificador)) {
            return Optional.empty();
        }

        try {
            return buscarPorGithubId(Long.valueOf(identificador.trim()));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }

    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public String obterDashboard(Usuario usuario) {
        if (usuario == null) {
            return "/login/sing-up";
        }

        if (usuario instanceof Empresa) {
            return "/empresas/dashboard";
        }
        if (usuario instanceof Freelancer) {
            return "/freelancers/dashboard";
        }
        if ("empresa".equalsIgnoreCase(usuario.getTipo())) {
            return "/empresas/dashboard";
        }
        if ("freelancer".equalsIgnoreCase(usuario.getTipo())) {
            return "/freelancers/dashboard";
        }
        return "/login/sing-up";
    }

    private Optional<Usuario> buscarUsuarioOAuth(OAuth2UserInfo oAuth2UserInfo) {
        if (AuthProvider.GITHUB.equals(oAuth2UserInfo.provider()) && oAuth2UserInfo.githubId() != null) {
            Optional<Usuario> usuarioPorGithubId = usuarioRepository.findByGithubId(oAuth2UserInfo.githubId());
            if (usuarioPorGithubId.isPresent()) {
                return usuarioPorGithubId;
            }
        }

        if (AuthProvider.GOOGLE.equals(oAuth2UserInfo.provider()) && StringUtils.hasText(oAuth2UserInfo.googleId())) {
            Optional<Usuario> usuarioPorGoogleId = usuarioRepository.findByGoogleId(oAuth2UserInfo.googleId().trim());
            if (usuarioPorGoogleId.isPresent()) {
                return usuarioPorGoogleId;
            }
        }

        if (StringUtils.hasText(oAuth2UserInfo.email())) {
            Optional<Usuario> usuarioPorEmail = usuarioRepository.findByEmailIgnoreCase(normalizarEmail(oAuth2UserInfo.email()));
            if (usuarioPorEmail.isPresent()) {
                return usuarioPorEmail;
            }
        }

        return Optional.empty();
    }

    private Usuario atualizarDadosOAuth(Usuario usuario, OAuth2UserInfo oAuth2UserInfo) {
        usuario.setOauth(Boolean.TRUE);
        usuario.setProvider(oAuth2UserInfo.provider());
        usuario.setGithubId(oAuth2UserInfo.githubId());
        usuario.setGoogleId(oAuth2UserInfo.googleId());

        if (StringUtils.hasText(oAuth2UserInfo.nome())) {
            usuario.setNome(oAuth2UserInfo.nome());
        }

        String emailNormalizado = normalizarEmailOauth(oAuth2UserInfo);
        if (StringUtils.hasText(emailNormalizado)) {
            validarEmailDisponivel(emailNormalizado, usuario.getIdUsuario());
            usuario.setEmail(emailNormalizado);
        }

        if (!StringUtils.hasText(usuario.getSenha())) {
            usuario.setSenha(passwordEncoder.encode(UUID.randomUUID().toString()));
        }

        return usuarioRepository.save(usuario);
    }

    private Usuario criarUsuarioOAuth(OAuth2UserInfo oAuth2UserInfo, String tipo) {
        Usuario usuario;

        if ("empresa".equals(tipo)) {
            Empresa empresa = new Empresa();
            empresa.setTipo("empresa");
            usuario = empresa;
        } else if ("freelancer".equals(tipo)) {
            Freelancer freelancer = new Freelancer();
            freelancer.setTipo("freelancer");
            usuario = freelancer;
        } else {
            throw new OAuthAuthenticationException("tipo", "Tipo de cadastro invalido.");
        }

        usuario.setNome(oAuth2UserInfo.nome());
        usuario.setEmail(normalizarEmailOauth(oAuth2UserInfo));
        usuario.setOauth(Boolean.TRUE);
        usuario.setProvider(oAuth2UserInfo.provider());
        usuario.setGithubId(oAuth2UserInfo.githubId());
        usuario.setGoogleId(oAuth2UserInfo.googleId());
        usuario.setSenha(passwordEncoder.encode(UUID.randomUUID().toString()));

        validarEmailDisponivel(usuario.getEmail(), null);

        return usuarioRepository.save(usuario);
    }

    private void validarEmailDisponivel(String email, Integer idAtual) {
        if (!StringUtils.hasText(email)) {
            return;
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmailIgnoreCase(normalizarEmail(email));

        if (usuarioExistente.isPresent()
                && (idAtual == null || !usuarioExistente.get().getIdUsuario().equals(idAtual))) {
            throw new IllegalArgumentException("E-mail ja cadastrado.");
        }
    }

    private void prepararSenha(Usuario usuario) {
        if (StringUtils.hasText(usuario.getSenha())
                && !usuario.getSenha().startsWith("$2a$")
                && !usuario.getSenha().startsWith("$2b$")
                && !usuario.getSenha().startsWith("$2y$")) {

            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
    }

    private String normalizarEmailOauth(OAuth2UserInfo oAuth2UserInfo) {
        if (StringUtils.hasText(oAuth2UserInfo.email())) {
            return normalizarEmail(oAuth2UserInfo.email());
        }

        if (AuthProvider.GITHUB.equals(oAuth2UserInfo.provider()) && oAuth2UserInfo.githubId() != null) {
            return oAuth2UserInfo.githubId() + GITHUB_EMAIL_DOMAIN;
        }

        if (AuthProvider.GOOGLE.equals(oAuth2UserInfo.provider()) && StringUtils.hasText(oAuth2UserInfo.googleId())) {
            return oAuth2UserInfo.googleId().trim().toLowerCase() + GOOGLE_EMAIL_DOMAIN;
        }

        if (StringUtils.hasText(oAuth2UserInfo.login())) {
            String domain = AuthProvider.GOOGLE.equals(oAuth2UserInfo.provider()) ? GOOGLE_EMAIL_DOMAIN : GITHUB_EMAIL_DOMAIN;
            return oAuth2UserInfo.login().trim().toLowerCase() + domain;
        }

        throw new OAuthAuthenticationException("email-oauth", "Nao foi possivel gerar identificador para o login OAuth.");
    }

    private String normalizarEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }

        return email.trim().toLowerCase();
    }

    private String resolverTipoCadastro(String tipo) {
        if (!StringUtils.hasText(tipo)) {
            throw new OAuthAuthenticationException("tipo-oauth", "Escolha se deseja entrar como freelancer ou empresa.");
        }

        String tipoNormalizado = tipo.trim().toLowerCase();
        if (!"empresa".equals(tipoNormalizado) && !"freelancer".equals(tipoNormalizado)) {
            throw new OAuthAuthenticationException("tipo-oauth", "Tipo de cadastro invalido para OAuth.");
        }

        return tipoNormalizado;
    }

    private void validarCadastroLocal(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Dados do cadastro nao informados.");
        }
        if (!StringUtils.hasText(usuario.getNome())) {
            throw new IllegalArgumentException("Informe seu nome.");
        }
        if (!StringUtils.hasText(usuario.getEmail())) {
            throw new IllegalArgumentException("Informe seu e-mail.");
        }
        if (!StringUtils.hasText(usuario.getSenha())) {
            throw new IllegalArgumentException("Informe sua senha.");
        }
        if (usuario.getSenha().trim().length() < 8) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 8 caracteres.");
        }
    }
}
