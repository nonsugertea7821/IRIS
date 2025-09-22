package com.github.nonsugertea7821.iris.src.common.auth.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ChallengeResponse> getChallenge(@RequestParam UUID userId) {
        try {
            ChallengeResponse challenge = service.getChallenge(userId);
            return ResponseEntity.ok(challenge);
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody AuthRequest req) {
        try {
            LoginResponse token = service.authenticate(req.getUserId(), req.getPasswordHash());
            return ResponseEntity.ok(token);
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody Map<String, String> req) {
        try {
            String refreshToken = req.get("refreshToken");
            LoginResponse newTokens = service.refresh(refreshToken);
            return ResponseEntity.ok(newTokens);
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestBody Map<String, String> req) {
        service.logout(req.get("refreshToken"));
        return ResponseEntity.ok(Map.of("resultCode", 0, "message", "ログアウト成功"));
    }
}
