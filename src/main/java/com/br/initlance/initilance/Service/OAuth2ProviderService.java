package com.br.initlance.initilance.Service;

import java.util.Arrays;
import java.util.Objects;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.br.initlance.initilance.Security.OAuthAuthenticationException;
import com.br.initlance.initilance.entity.AuthProvider;

@Service
public class OAuth2ProviderService {

    private static final String GITHUB_REGISTRATION_ID = "github";
    private static final String GOOGLE_REGISTRATION_ID = "google";
    private static final String GITHUB_EMAILS_URL = "https://api.github.com/user/emails";

    private final OAuth2AuthorizedClientService authorizedClientService;
    private final RestTemplate restTemplate;

    public OAuth2ProviderService(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
        this.restTemplate = new RestTemplate();
    }

    public OAuth2UserInfo carregarUsuario(Authentication authentication) {
        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            throw new OAuthAuthenticationException("oauth-invalido", "Autenticacao OAuth2 invalida.");
        }

        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        if (GITHUB_REGISTRATION_ID.equals(registrationId)) {
            return carregarUsuarioGithub(oauthToken);
        }
        if (GOOGLE_REGISTRATION_ID.equals(registrationId)) {
            return carregarUsuarioGoogle(oauthToken);
        }

        throw new OAuthAuthenticationException("oauth-provedor", "Provedor OAuth2 nao suportado.");
    }

    private OAuth2UserInfo carregarUsuarioGithub(OAuth2AuthenticationToken oauthToken) {
        OAuth2User oauth2User = oauthToken.getPrincipal();
        Long githubId = converterGithubId(oauth2User.getAttribute("id"));
        String login = normalizarTexto(oauth2User.getAttribute("login"));
        String nome = normalizarTexto(oauth2User.getAttribute("name"));

        if (!StringUtils.hasText(nome)) {
            nome = login;
        }

        if (!StringUtils.hasText(nome)) {
            throw new OAuthAuthenticationException("nome-github", "Nao foi possivel identificar o nome do usuario GitHub.");
        }

        return new OAuth2UserInfo(
                AuthProvider.GITHUB,
                githubId,
                null,
                buscarEmailGithub(oauthToken),
                nome,
                login);
    }

    private OAuth2UserInfo carregarUsuarioGoogle(OAuth2AuthenticationToken oauthToken) {
        OAuth2User oauth2User = oauthToken.getPrincipal();
        String googleId = normalizarTexto(oauth2User.getAttribute("sub"));
        String email = normalizarTexto(oauth2User.getAttribute("email"));
        String nome = normalizarTexto(oauth2User.getAttribute("name"));
        String login = email;

        if (!StringUtils.hasText(googleId)) {
            throw new OAuthAuthenticationException("google-id", "Nao foi possivel identificar o usuario Google.");
        }

        if (!StringUtils.hasText(nome)) {
            nome = normalizarTexto(oauth2User.getAttribute("given_name"));
        }

        if (!StringUtils.hasText(nome)) {
            nome = email;
        }

        if (!StringUtils.hasText(nome)) {
            nome = googleId;
        }

        return new OAuth2UserInfo(
                AuthProvider.GOOGLE,
                null,
                googleId,
                normalizarEmail(email),
                nome,
                login);
    }

    private String buscarEmailGithub(OAuth2AuthenticationToken oauthToken) {
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                oauthToken.getName());

        if (authorizedClient == null || authorizedClient.getAccessToken() == null) {
            throw new OAuthAuthenticationException("token-github", "Nao foi possivel obter o access token do GitHub.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authorizedClient.getAccessToken().getTokenValue());
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.set(HttpHeaders.USER_AGENT, "Initlance-App");

        try {
            GitHubEmailResponse[] emails = restTemplate.exchange(
                    GITHUB_EMAILS_URL,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    GitHubEmailResponse[].class)
                    .getBody();

            if (emails == null || emails.length == 0) {
                return null;
            }

            return Arrays.stream(emails)
                    .filter(Objects::nonNull)
                    .filter(email -> Boolean.TRUE.equals(email.verified()))
                    .filter(email -> Boolean.TRUE.equals(email.primary()))
                    .map(GitHubEmailResponse::email)
                    .filter(StringUtils::hasText)
                    .findFirst()
                    .or(() -> Arrays.stream(emails)
                            .filter(Objects::nonNull)
                            .filter(email -> Boolean.TRUE.equals(email.verified()))
                            .map(GitHubEmailResponse::email)
                            .filter(StringUtils::hasText)
                            .findFirst())
                    .or(() -> Arrays.stream(emails)
                            .filter(Objects::nonNull)
                            .filter(email -> Boolean.TRUE.equals(email.primary()))
                            .map(GitHubEmailResponse::email)
                            .filter(StringUtils::hasText)
                            .findFirst())
                    .or(() -> Arrays.stream(emails)
                            .filter(Objects::nonNull)
                            .map(GitHubEmailResponse::email)
                            .filter(StringUtils::hasText)
                            .findFirst())
                    .map(this::normalizarEmail)
                    .orElse(null);
        } catch (RestClientException ex) {
            return null;
        }
    }

    private Long converterGithubId(Object githubId) {
        if (githubId == null) {
            return null;
        }

        if (githubId instanceof Number number) {
            return number.longValue();
        }

        try {
            return Long.valueOf(githubId.toString());
        } catch (NumberFormatException ex) {
            throw new OAuthAuthenticationException("github-id", "Identificador GitHub invalido.");
        }
    }

    private String normalizarTexto(Object valor) {
        if (valor == null) {
            return null;
        }

        String texto = valor.toString().trim();
        return StringUtils.hasText(texto) ? texto : null;
    }

    private String normalizarEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }

        return email.trim().toLowerCase();
    }

    private record GitHubEmailResponse(String email, Boolean primary, Boolean verified) {
    }

    public record OAuth2UserInfo(
            AuthProvider provider,
            Long githubId,
            String googleId,
            String email,
            String nome,
            String login) {
    }
}
