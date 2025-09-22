package com.github.nonsugertea7821.iris.src.common.auth.dto;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.RequiredArgsConstructor;

/**
 * 認証/権限情報
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025-09-14
 */
@RequiredArgsConstructor
public enum Role {
    DEFAULT("default"),
    ADMINISTRATOR("administrator");

    private final String role;

    public static final Role toRole(String role) {
        return switch (role) {
            case "default" ->
                DEFAULT;
            case "administrator" ->
                ADMINISTRATOR;
            default ->
                throw new IllegalArgumentException("Unknown role: " + role);
        };
    }

    /**
     * springの権限情報に置換
     *
     * @return 権限情報
     */
    public Collection<GrantedAuthority> toAuthorities() {
        var result = new ArrayList<GrantedAuthority>();
        switch (this) {
            case DEFAULT ->
                result.add(new SimpleGrantedAuthority("ROLE_DEFAULT"));
            case ADMINISTRATOR ->
                result.add(new SimpleGrantedAuthority("ROLE_ADMINISTRATOR"));
        }
        return result;
    }

    @Override
    public String toString() {
        return this.role;
    }
}
