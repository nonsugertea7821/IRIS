package com.github.nonsugertea7821.iris.src.common.auth.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import com.github.nonsugertea7821.iris.src.common.auth.dto.User;
import com.github.nonsugertea7821.iris.src.common.utils.QueryLoader;

import lombok.RequiredArgsConstructor;

/**
 * 認証/リポジトリ機能
 *
 * @author nonsugertea7821
 * @version 0.1.1
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
    private static final String SQL_AUTH_S004 = "auth.query.selectRole";

    private static final String USERS_TABLE_COLUMN_LABEL_ID = "id";
    private static final String USERS_TABLE_COLUMN_LABEL_NAME = "name";
    private static final String USERS_TABLE_COLUMN_LABEL_PASSWORD_HASH = "password_hash";
    private static final String USERS_TABLE_COLUMN_LABEL_ROLE_ID = "role_id";
    private static final String ROLES_TABLE_COLUMN_LABEL_ID = "id";
    private static final String ROLES_TABLE_COLUMN_LABEL_NAME = "name";
    private static final String SALTS_TABLE_COLUMN_LABEL_ID = "user_id";
    private static final String SALTS_TABLE_COLUMN_LABEL_SALT = "salt";

    /**
     * ユーザー名からユーザー情報の実体を取得します。
     * @param userName ユーザー名
     * @return ユーザー情報
     */
    public User getUserByName(String userName) {
        return findUser(SQL_AUTH_S001, USERS_TABLE_COLUMN_LABEL_NAME, userName);
    }

    /**
     * ユーザー識別子からユーザー情報の実体を取得します。
     * @param userId ユーザー識別子
     * @return ユーザー情報
     */
    public User getUserById(UUID userId) {
        return findUser(SQL_AUTH_S002, USERS_TABLE_COLUMN_LABEL_ID, userId);
    }

    /**
     * ユーザー情報を取得します。
     * @param sqlKey 情報取得に使用するSQLのキー
     * @param paramName 引数名
     * @param paramValue 引数値
     * @return
     */
    private User findUser(String sqlKey, String paramName, Object paramValue) {
        User user = jdbcClient.sql(QueryLoader.load(QUERY_PATH, sqlKey))
                .param(paramName, paramValue)
                .query(rs -> {
                    if (rs.next()) {
                        return mapToUser(rs);
                    }
                    throw new UserNotFoundException("User not found: " + paramValue);
                });
        return user;
    }

    /**
     * クエリ結果をユーザー情報にマッピングします。
     *
     * @param rs リザルトセット
     * @return {@link User} ユーザー情報
     */
    private User mapToUser(ResultSet rs) throws SQLException {
        var id = UUID.fromString(rs.getString(USERS_TABLE_COLUMN_LABEL_ID));
        var name = rs.getString(USERS_TABLE_COLUMN_LABEL_NAME);
        var role_Id = rs.getInt(USERS_TABLE_COLUMN_LABEL_ROLE_ID);
        var role = findRole(role_Id);
        var salt = findSalt(id);
        var passwordHash = rs.getString(USERS_TABLE_COLUMN_LABEL_PASSWORD_HASH);
        return new User(id, name, role, passwordHash,salt);
    }

    /**
     * 権限情報の実体を返します。
     *
     * @param id ロールID
     */
    private String findRole(int id) {
        return jdbcClient.sql(QueryLoader.load(QUERY_PATH, SQL_AUTH_S004))
                .param(ROLES_TABLE_COLUMN_LABEL_ID, id)
                .query(rs -> {
                    if (rs.next()) {
                        return rs.getString(ROLES_TABLE_COLUMN_LABEL_NAME);
                    }
                    throw new UserNotFoundException("User salt not found: " + id);
                });
    }

    /**
     * ソルトを返します。
     * @param userId ユーザー識別子
     * @return ソルト
     */
    private String findSalt(UUID userId){
        return jdbcClient.sql(QueryLoader.load(QUERY_PATH, SQL_AUTH_S003))
                .param(SALTS_TABLE_COLUMN_LABEL_ID, userId)
                .query(rs -> {
                    if (rs.next()) {
                        return rs.getString(SALTS_TABLE_COLUMN_LABEL_SALT);
                    }
                    throw new UserNotFoundException("User salt not found");
                });
    }

    // 専用例外
    public static class UserNotFoundException extends RuntimeException {

        public UserNotFoundException(String message) {
            super(message);
        }
    }
}
