package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dto.BannerCreateDto;
import com.web.invoice.primarydb.dto.BannerDetailedDto;
import com.web.invoice.primarydb.dto.BannerSummaryDto;
import com.web.invoice.primarydb.dao.BannerRepository;
import com.web.invoice.primarydb.dao.GroupBannerRepository;
import com.web.invoice.primarydb.dao.TypeBannerRepository;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.List;


@Service
public class BannerService {
    private final ValidationHelper validator;
    private final BannerDtoMapper bannerDtoMapper;
    private final BannerRepository bannerRepository;
    private final TypeBannerRepository typeBannerRepository;
    private final GroupBannerRepository groupBannerRepository;

    public BannerService(
            final ValidationHelper validator,
            final BannerDtoMapper bannerDtoMapper,
            final BannerRepository bannerRepository,
            final TypeBannerRepository typeBannerRepository,
            final GroupBannerRepository groupBannerRepository
    ) {
        this.validator = validator;
        this.bannerDtoMapper = bannerDtoMapper;
        this.bannerRepository = bannerRepository;
        this.typeBannerRepository = typeBannerRepository;
        this.groupBannerRepository = groupBannerRepository;
    }


    @Transactional
    public void saveBanner(final BannerCreateDto dto) {
        validator.validate(dto);
        bannerRepository.save(bannerDtoMapper.map(dto));
    }

    @Transactional
    public void modifyBanner(final Integer codeBanner, BannerCreateDto dto) {
        validator.validate(dto);
    }

    @Transactional
    public void deleteBanner(final Integer codeBanner) {

    }

    public List<BannerSummaryDto> getAllBanners() {

    }

    public BannerDetailedDto getBannerDetails(final Integer codeBanner) {

    }

    public List<BannerSummaryDto> getAllBannersFiltered() {

    }
}

