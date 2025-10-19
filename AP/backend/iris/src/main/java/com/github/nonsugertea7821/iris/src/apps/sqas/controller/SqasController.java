package com.github.nonsugertea7821.iris.src.apps.sqas.controller;

import java.util.Date;
import java.util.Locale;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.github.nonsugertea7821.iris.src.apps.sqas.dto.request.StockAnalysisRequest;
import com.github.nonsugertea7821.iris.src.apps.sqas.dto.response.StockInfoResponse;
import com.github.nonsugertea7821.iris.src.apps.sqas.service.SqasService;

import lombok.RequiredArgsConstructor;

/**
 * SQAS/コントローラー機能
 *
 * @author nonsugertea7821
 */
@RestController
@RequestMapping("/api/sqas")
@RequiredArgsConstructor
public class SqasController {

    private final SqasService service;

    @PostMapping(value = "/parse-stock-screener-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StockInfoResponse parseStockScreeerCSV(
            @RequestParam MultipartFile file,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") Date extractDate,
            @RequestParam Locale extractLocale
    ) {
        return service.parseStockScreenerCsv(file, extractDate, extractLocale);
    }

    @PutMapping(value = "/put-stock-info")
    public void putStockInfo(@RequestParam UUID dataKey) throws Exception {
        service.putStockInfo(dataKey);
    }

    @PostMapping(value = "/struct-analysis-job")
    public String structAnalysisJob(@RequestBody StockAnalysisRequest request) {
        return service.structAnalysisJob(request.getParams());
    }

}
