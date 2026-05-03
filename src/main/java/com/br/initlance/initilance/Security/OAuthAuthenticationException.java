package com.br.initlance.initilance.Security;

public class OAuthAuthenticationException extends RuntimeException {

    private final String errorCode;

    public OAuthAuthenticationException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
