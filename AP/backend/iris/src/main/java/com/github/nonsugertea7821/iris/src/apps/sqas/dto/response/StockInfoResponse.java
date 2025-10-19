package com.github.nonsugertea7821.iris.src.apps.sqas.dto.response;

import java.util.List;
import java.util.UUID;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class StockInfoResponse {
    /** データ識別子 */
    private final UUID key;
    /** データ */
    private final List<StockInfo> data;    
}
