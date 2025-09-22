package com.github.nonsugertea7821.iris.src.common.anotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 列物理名マップアトリビュート
 *
 * @author nonsugertea7821
 * @since 2025/09/22
 * @version 0.1.0
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Column {

    /**
     * 物理名
     */
    String phy();

    /**
     * 和名
     */
    String ja();
}
