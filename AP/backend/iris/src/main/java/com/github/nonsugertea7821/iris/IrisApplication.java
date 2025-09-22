package com.github.nonsugertea7821.iris;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class IrisApplication {

    public static void main(String[] args) {
        SpringApplication.run(IrisApplication.class, args);
    }

}
