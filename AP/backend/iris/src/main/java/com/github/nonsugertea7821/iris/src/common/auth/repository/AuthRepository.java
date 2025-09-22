package com.github.nonsugertea7821.iris.src.common.auth.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import com.github.nonsugertea7821.iris.src.common.auth.dto.Role;
import com.github.nonsugertea7821.iris.src.common.auth.dto.User;
import com.github.nonsugertea7821.iris.src.common.utils.QueryLoader;

import lombok.RequiredArgsConstructor;

/**
 * 認証/リポジトリ機能
 *
 * @author nonsugertea7821
 * @version 0.1.0
 * @since 2025-09-13
 */
@Repository
@RequiredArgsConstructor
public class AuthRepository {

    private final JdbcClient jdbcClient;

    private static final String QUERY_PATH = "sql\\auth\\querys.properties";

    private static final String SQL_AUTH_S001 = "auth.query.selectUserByName";
    private static final String SQL_AUTH_S002 = "auth.query.selectUserById";
    private static final String SQL_AUTH_S003 = "auth.query.selectSalt";

    private static final String USERS_TABLE_COLUMN_LABEL_ID = "id";
    private static final String USERS_TABLE_COLUMN_LABEL_NAME = "name";
    private static final String USERS_TABLE_COLUMN_LABEL_PASSWORD_HASH = "password_hash";
    private static final String USERS_TABLE_COLUMN_LABEL_ROLE = "role";
    private static final String SALTS_TABLE_COLUMN_LABEL_ID = "user_id";
    private static final String SALTS_TABLE_COLUMN_LABEL_SALT = "salt";

    @Cacheable(value = "CACHE_AUTH_I001", key = "#userName")
    public User getUserByName(String userName) {
        return findUser(SQL_AUTH_S001, USERS_TABLE_COLUMN_LABEL_NAME, userName);
    }

    @Cacheable(value = "CACHE_AUTH_I002", key = "#userId")
    public User getUserById(UUID userId) {
        return findUser(SQL_AUTH_S002, USERS_TABLE_COLUMN_LABEL_ID, userId);
    }

    private User findUser(String sqlKey, String paramName, Object paramValue) {
        User user = jdbcClient.sql(QueryLoader.load(QUERY_PATH, sqlKey))
                .param(paramName, paramValue)
                .query(rs -> {
                    if (rs.next()) {
                        return mapToUser(rs);
                    }
                    throw new UserNotFoundException("User not found: " + paramValue);
                });

        String salt = jdbcClient.sql(QueryLoader.load(QUERY_PATH, SQL_AUTH_S003))
                .param(SALTS_TABLE_COLUMN_LABEL_ID, user.getId())
                .query(rs -> {
                    if (rs.next()) {
                        return rs.getString(SALTS_TABLE_COLUMN_LABEL_SALT);
                    }
                    throw new UserNotFoundException("User salt not found: " + paramValue);
                });

        user.setSalt(salt);
        return user;
    }

    private User mapToUser(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString(USERS_TABLE_COLUMN_LABEL_ID));
        var name = rs.getString(USERS_TABLE_COLUMN_LABEL_NAME);
        var role = Role.toRole(rs.getString(USERS_TABLE_COLUMN_LABEL_ROLE));
        var passwordHash = rs.getString(USERS_TABLE_COLUMN_LABEL_PASSWORD_HASH);
        return new User(id, name, role, passwordHash);
    }

    // 専用例外
    public static class UserNotFoundException extends RuntimeException {

        public UserNotFoundException(String message) {
            super(message);
        }
    }
}
