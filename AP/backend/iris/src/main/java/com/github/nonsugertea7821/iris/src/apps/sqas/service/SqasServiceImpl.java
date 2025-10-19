package com.github.nonsugertea7821.iris.src.apps.sqas.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.apache.commons.io.input.BOMInputStream;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockAnalysisParams;
import com.github.nonsugertea7821.iris.src.apps.sqas.dto.StockInfo;
import com.github.nonsugertea7821.iris.src.apps.sqas.dto.response.StockInfoResponse;
import com.github.nonsugertea7821.iris.src.apps.sqas.model.StockInfoCSVParser;
import com.github.nonsugertea7821.iris.src.apps.sqas.repository.StockInfoRepository;
import com.github.nonsugertea7821.iris.src.common.bases.ServiceBase;
import com.github.nonsugertea7821.iris.src.common.cache.CacheStore;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SqasServiceImpl extends ServiceBase implements SqasService {

    private final StockInfoCSVParser parser;
    private final StockInfoRepository stockInfoRepository;

    private static final long CACHE_TTL = 10 * 60 * 1000; // 10分
    private final CacheStore<List<StockInfo>> parsedStockInfoCache = new CacheStore<>(CACHE_TTL);

    @Override
    public StockInfoResponse parseStockScreenerCsv(MultipartFile file, Date extractDate,Locale extractLocale) {
        try (var reader = new BufferedReader(new InputStreamReader(
                new BOMInputStream.Builder().setInputStream(file.getInputStream()).get(),
                StandardCharsets.UTF_8))) {
            UUID userId = super.getCurrentUserId();
            List<StockInfo> dataList = parser.parseAll(userId, reader, extractDate, extractLocale);
            UUID dataKey = parsedStockInfoCache.put(dataList);
            return new StockInfoResponse(dataKey, dataList);
        } catch (Exception e) {
            throw new RuntimeException("CSV処理に失敗しました: " + e.getMessage(), e);
        }
    }

    @Override
    public void putStockInfo(UUID dataKey) throws Exception {
        List<StockInfo> entry = parsedStockInfoCache.fetch(dataKey, true);
        if(entry == null || entry.isEmpty()){
            throw new Exception("キャッシュが失効しました。もう一度CSVを入力してください。");
        }
        stockInfoRepository.save(entry);
    }

    @Override
    public String structAnalysisJob(StockAnalysisParams params) {
        // TODO Auto-generated method stub
        return null;
    }

}
