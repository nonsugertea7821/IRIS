package com.github.nonsugertea7821.iris.src.common.auth.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.nonsugertea7821.iris.src.common.auth.dto.request.AuthRequest;
import com.github.nonsugertea7821.iris.src.common.auth.dto.response.ChallengeResponse;
import com.github.nonsugertea7821.iris.src.common.auth.dto.response.LoginResponse;
import com.github.nonsugertea7821.iris.src.common.auth.service.AuthServiceImpl;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;

/**
 * 認証/コントローラー機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025/09/15
 */
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl service;

    @GetMapping("/get-userId")
    public UUID getUserId(@RequestParam String userName) {
        return service.getUserId(userName);
    }

    @GetMapping("/get-challenge")
    public ChallengeResponse getChallenge(@RequestParam UUID userId) throws AuthException {
        ChallengeResponse challenge = service.getChallenge(userId);
        return challenge;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody AuthRequest req) throws AuthException {
        LoginResponse token = service.authenticate(req.getUserId(), req.getPasswordHash());
        return token;
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestBody Map<String, String> req) throws AuthException {
        String refreshToken = req.get("refreshToken");
        LoginResponse newTokens = service.refresh(refreshToken);
        return newTokens;
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(@RequestBody Map<String, String> req) {
        service.logout(req.get("refreshToken"));
        return Map.of("resultCode", 0, "message", "ログアウト成功");
    }
}
