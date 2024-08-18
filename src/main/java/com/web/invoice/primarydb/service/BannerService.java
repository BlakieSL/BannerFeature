package com.web.invoice.primarydb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.component.JsonPatchHelper;
import com.web.invoice.primarydb.dto.*;
import com.web.invoice.primarydb.dao.BannerRepository;
import com.web.invoice.primarydb.dao.GroupBannerRepository;
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
    private final GroupBannerRepository groupBannerRepository;

    public BannerService(
            ValidationHelper validator,
            BannerMapper bannerMapper,
            JsonPatchHelper jsonPatchHelper,
            BannerRepository bannerRepository,
            GroupBannerRepository groupBannerRepository
    ) {
        this.validator = validator;
        this.bannerMapper = bannerMapper;
        this.jsonPatchHelper = jsonPatchHelper;
        this.bannerRepository = bannerRepository;
        this.groupBannerRepository = groupBannerRepository;
    }

    @Transactional
    public void saveBanner(BannerDtoRequest dto) {
        validator.validate(dto);
        Banner banner = bannerMapper.toEntity(dto);
        bannerRepository.save(banner);
    }

    @Transactional
    public void modifyBanner(int codeBanner, JsonMergePatch patch) throws JsonPatchException, JsonProcessingException {
        Banner banner = bannerRepository.findById(codeBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + codeBanner + " not found"));

        if(banner.getStatus() == 3) {
            throw new BannerAlreadySentException(
                    "Новина вже відправлена(статус відправлено (3)). Редагування заборонено");
        }

        BannerDtoRequest dto = bannerMapper.toRequestDto(banner);
        BannerDtoRequest patchedDto = jsonPatchHelper.applyPatch(patch, dto, BannerDtoRequest.class);

        validator.validate(patchedDto);
        bannerMapper.updateEntityFromDto(patchedDto,banner);
        bannerMapper.customUpdate(patchedDto, banner);

        bannerRepository.save(banner);
    }

    @Transactional
    public void deleteBanner(int codeBanner) {
        Banner banner = bannerRepository.findById(codeBanner)
                        .orElseThrow(() -> new NoSuchElementException(
                                "Banner with id: " + codeBanner + " not found"));
        if(banner.getStatus() == 3){
            throw new BannerAlreadySentException(
                    "Новина вже відправлена(статус відправлено (3)). Видалення заборонено");
        }
        bannerRepository.delete(banner);
    }

    @Transactional
    public void moveBannerToAnotherGroup(int codeBanner, int codeGroupBanner) {
        Banner banner = bannerRepository.findById(codeBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + codeBanner + " not found"));

        GroupBanner groupBanner = groupBannerRepository.findById(codeGroupBanner)
                        .orElseThrow(() -> new NoSuchElementException(
                                "GroupBanner with id: " + codeGroupBanner + " not found"));

        banner.setGroupBanner(groupBanner);
        bannerRepository.save(banner);
    }

    @Transactional
    public void copyBanner(int codeBanner, int targetCodeGroupBanner) {
        Banner banner = bannerRepository.findById(codeBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + codeBanner + " not found"));

        GroupBanner targerGroupBanner = groupBannerRepository.findById(targetCodeGroupBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "GroupBanner with id: " + targetCodeGroupBanner + "not found"));

        Banner copiedBanner = bannerMapper.copyBanner(banner, targerGroupBanner);

        bannerRepository.save(copiedBanner);
    }

    @Transactional
    public void deleteBanners(final BannersDeletionDto dto) {
        for(Integer codeBanner: dto.getCodeBanners()) {
            try {
                deleteBanner(codeBanner);
            } catch (BannerAlreadySentException e) {
                System.out.println("Could not delete banner with ID " + codeBanner + ": " + e.getMessage());
            }
        }
    }

    public BannerDetailedDto getBannerDetails(int codeBanner) {
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

    public List<BannerSummaryDto> getAllBannersFiltered(BannerFilterDto dto) {
        List<Banner> banners = bannerRepository.findByTypeStatusAndGroup(dto.getCodeGroupBanner(), dto.getCodeTypeBanner(), dto.getStatus())
                .orElseThrow(() -> new NoSuchElementException(
                        "no banners found"));

        return banners.stream()
                .map(bannerMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    public List<BannerSummaryDto> getAllBannersByGroup(int codeGroupBanner) {
        List<Banner> banners = bannerRepository.findByGroupBannerCodeGroupBanner(codeGroupBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "no banners found"));

        return banners.stream()
                .map(bannerMapper::toSummaryDto)
                .collect(Collectors.toList());
    }
}

