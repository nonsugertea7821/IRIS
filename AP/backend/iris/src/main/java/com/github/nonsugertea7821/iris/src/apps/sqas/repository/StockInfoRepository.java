package com.github.nonsugertea7821.iris.src.apps.sqas.repository;

import java.util.List;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;

public interface StockInfoRepository {

    void save(List<StockInfo> info);
}
