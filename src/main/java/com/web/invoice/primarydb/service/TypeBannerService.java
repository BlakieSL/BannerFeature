package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.TypeBannerRepository;
import com.web.invoice.primarydb.dto.TypeBannerDto;
import com.web.invoice.primarydb.mapper.TypeBannerMapper;
import com.web.invoice.primarydb.model.TypeBanner;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TypeBannerService {
    private final TypeBannerMapper typeBannerMapper;
    private final TypeBannerRepository typeBannerRepository;

    public TypeBannerService(
            final TypeBannerMapper typeBannerMapper,
            final TypeBannerRepository typeBannerRepository
    ) {
        this.typeBannerMapper = typeBannerMapper;
        this.typeBannerRepository = typeBannerRepository;
    }

    public List<TypeBannerDto> getAllTypeBanners() {
        List<TypeBanner> typeBanners = typeBannerRepository.findAll();
        return typeBanners.stream()
                .map(typeBannerMapper::toDto)
                .collect(Collectors.toList());
    }
}
