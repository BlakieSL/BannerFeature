package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.dto.TypeBannerDto;
import com.web.invoice.primarydb.service.TypeBannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/type-banners")
public class TypeBannerController {
    private final TypeBannerService typeBannerService;

    public TypeBannerController(
            final TypeBannerService typeBannerService
    ) {
        this.typeBannerService = typeBannerService;
    }

    @GetMapping
    public ResponseEntity<List<TypeBannerDto>> getAllTypeBanners() {
        List<TypeBannerDto> types = typeBannerService.getAllTypeBanners();
        return ResponseEntity.ok(types);
    }
}
