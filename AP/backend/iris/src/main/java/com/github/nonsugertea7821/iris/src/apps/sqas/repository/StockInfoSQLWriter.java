package com.github.nonsugertea7821.iris.src.apps.sqas.repository;

import java.lang.reflect.Field;
import java.util.List;
import java.util.stream.Collectors;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;
import com.github.nonsugertea7821.iris.src.common.anotations.Column;

/**
 * SQAS/StockInfoデータベースアダプター
 *
 * @author nonsugertea7821
 * @since 2025/09/22
 * @version 0.1.0
 */
public final class StockInfoSQLWriter {

    private static final String TABLE_NAME = "sqas.extract_stock_info";

    /**
     * StockInfoクラスからMERGE SQLを生成
     */
    public static String generateMergeSql() {
        // @Column付きフィールドのみ抽出
        List<Field> fields = List.of(StockInfo.class.getDeclaredFields()).stream()
                .filter(f -> f.isAnnotationPresent(Column.class))
                .collect(Collectors.toList());

        // DB列名リスト（スネークケース）
        List<String> dbColumns = fields.stream()
                .map(f -> f.getAnnotation(Column.class).phy())
                .collect(Collectors.toList());

        // SQLパラメータ名はフィールド名（キャメルケース）
        List<String> paramNames = fields.stream()
                .map(Field::getName)
                .map(name -> ":" + name)
                .collect(Collectors.toList());

        // UPDATE句生成（tickerとextract_dateは除外）
        String updateList = fields.stream()
                .filter(f -> {
                    String col = f.getAnnotation(Column.class).phy();
                    return !"ticker".equalsIgnoreCase(col) && !"extract_date".equalsIgnoreCase(col);
                })
                .map(f -> f.getAnnotation(Column.class).phy() + " = :" + f.getName())
                .collect(Collectors.joining(", "));

        if (updateList.isEmpty()) {
            updateList = "updated_at = NOW()"; // 更新対象がなくても安全策
        }

        // MERGE文生成
        return String.format(
        """
            MERGE INTO %s AS target
            USING (VALUES (%s)) AS source(%s)
            ON target.ticker = source.ticker AND DATE(target.extract_date) = DATE(source.extract_date)
            WHEN MATCHED THEN
            UPDATE SET %s
            WHEN NOT MATCHED THEN
            INSERT (%s)
            VALUES (%s);
        """,
        TABLE_NAME,
        String.join(", ", paramNames), // source VALUES
        String.join(", ", dbColumns), // source列名（DB列名）
        updateList, // UPDATE句
        String.join(", ", dbColumns), // INSERT列名
        String.join(", ", paramNames) // INSERT VALUES
        );
    }

}
