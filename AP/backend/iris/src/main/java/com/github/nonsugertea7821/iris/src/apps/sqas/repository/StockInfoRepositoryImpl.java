package com.github.nonsugertea7821.iris.src.apps.sqas.repository;

import java.util.List;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;

import lombok.RequiredArgsConstructor;

/**
 * SQAS/StockInfoリポジトリ機能
 *
 * @author nonsugartea7821
 */
@Repository
@RequiredArgsConstructor
public class StockInfoRepositoryImpl implements StockInfoRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public void save(List<StockInfo> info) {
        // バルクインサート/マージアップデート
        String sql = StockInfoSQLWriter.generateMergeSql();
        SqlParameterSource[] params = info.stream()
                .map(StockInfo::toSqlParameterSource)
                .toArray(SqlParameterSource[]::new);
        jdbcTemplate.batchUpdate(sql, params);
    }
}
