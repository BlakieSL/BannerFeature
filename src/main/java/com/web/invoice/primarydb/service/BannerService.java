package com.web.invoice.primarydb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.component.JsonPatchHelper;
import com.web.invoice.primarydb.dto.BannerDtoRequest;
import com.web.invoice.primarydb.dto.BannerDetailedDto;
import com.web.invoice.primarydb.dto.BannerSummaryDto;
import com.web.invoice.primarydb.dao.BannerRepository;
import com.web.invoice.primarydb.dao.GroupBannerRepository;
import com.web.invoice.primarydb.dao.TypeBannerRepository;
import com.web.invoice.primarydb.exception.BannerAlreadySentException;
import com.web.invoice.primarydb.mapper.BannerMapper;
import com.web.invoice.primarydb.model.Banner;
import com.web.invoice.primarydb.model.GroupBanner;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@Service
public class BannerService {
    private final ValidationHelper validator;
    private final BannerMapper bannerMapper;
    private final JsonPatchHelper jsonPatchHelper;
    private final BannerRepository bannerRepository;
    private final TypeBannerRepository typeBannerRepository;
    private final GroupBannerRepository groupBannerRepository;

    public BannerService(
            final ValidationHelper validator,
            final BannerMapper bannerMapper,
            final JsonPatchHelper jsonPatchHelper,
            final BannerRepository bannerRepository,
            final TypeBannerRepository typeBannerRepository,
            final GroupBannerRepository groupBannerRepository
    ) {
        this.validator = validator;
        this.bannerMapper = bannerMapper;
        this.jsonPatchHelper = jsonPatchHelper;
        this.bannerRepository = bannerRepository;
        this.typeBannerRepository = typeBannerRepository;
        this.groupBannerRepository = groupBannerRepository;
    }


    @Transactional
    public void saveBanner(final BannerDtoRequest dto) {
        validator.validate(dto);
        bannerRepository.save(bannerMapper.toEntity(dto));
    }

    @Transactional
    public void modifyBanner(final int codeBanner, final JsonMergePatch patch) throws JsonPatchException, JsonProcessingException {
        Banner banner = bannerRepository.findById(codeBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + codeBanner + " not found"));

        if(banner.getStatus() == 2) {
            throw new BannerAlreadySentException(
                    "Banner with id: " + codeBanner + " already sent");
        }

        BannerDtoRequest dto = bannerMapper.toRequestDto(banner);
        BannerDtoRequest patchedDto = jsonPatchHelper.applyPatch(patch, dto, BannerDtoRequest.class);

        validator.validate(patchedDto);
        bannerMapper.updateEntityFromDto(patchedDto,banner);

        bannerRepository.save(banner);
    }

    @Transactional
    public void deleteBanner(final int codeBanner) {
        Banner banner = bannerRepository.findById(codeBanner)
                        .orElseThrow(() -> new NoSuchElementException(
                                "Banner with id: " + codeBanner + " not found"));
        bannerRepository.delete(banner);
    }

    @Transactional
    public void moveBannerToAnotherGroup(final int codeBanner, final int codeGroupBanner) {
        Banner banner = bannerRepository.findById(codeBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + codeBanner + " not found"));
        GroupBanner groupBanner = groupBannerRepository.findById(codeGroupBanner)
                        .orElseThrow(() -> new NoSuchElementException(
                                "GroupBanner with id: " + codeGroupBanner + " not found"));
        banner.setGroupBanner(groupBanner);
        bannerRepository.save(banner);
    }

    public BannerDetailedDto getBannerDetails(final int codeBanner) {
        Banner banner = bannerRepository.findById(codeBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + codeBanner + " not found"));
        return bannerMapper.toDetailedDto(banner);
    }

    public List<BannerSummaryDto> getAllBanners() {
        List<Banner> banners = bannerRepository.findAll();
        return banners.stream()
                .map(bannerMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

}

