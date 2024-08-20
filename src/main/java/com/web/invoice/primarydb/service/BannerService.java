package com.web.invoice.primarydb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.component.JsonPatchHelper;
import com.web.invoice.primarydb.dao.ImageRepository;
import com.web.invoice.primarydb.dto.*;
import com.web.invoice.primarydb.dao.BannerRepository;
import com.web.invoice.primarydb.dao.GroupBannerRepository;
import com.web.invoice.primarydb.exception.BannerAlreadySentException;
import com.web.invoice.primarydb.mapper.BannerMapper;
import com.web.invoice.primarydb.model.Banner;
import com.web.invoice.primarydb.model.ConnectionData;
import com.web.invoice.primarydb.model.GroupBanner;
import com.web.invoice.primarydb.model.Image;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@Service
public class BannerService {
    private final ConfigService configService;
    private final ValidationHelper validator;
    private final BannerMapper bannerMapper;
    private final JsonPatchHelper jsonPatchHelper;
    private final BannerRepository bannerRepository;
    private final GroupBannerRepository groupBannerRepository;
    private final ImageRepository imageRepository;

    public BannerService(
            ConfigService configService,
            ValidationHelper validator,
            BannerMapper bannerMapper,
            JsonPatchHelper jsonPatchHelper,
            BannerRepository bannerRepository,
            GroupBannerRepository groupBannerRepository,
            ImageRepository imageRepository
    ) {
        this.configService = configService;
        this.validator = validator;
        this.bannerMapper = bannerMapper;
        this.jsonPatchHelper = jsonPatchHelper;
        this.bannerRepository = bannerRepository;
        this.groupBannerRepository = groupBannerRepository;
        this.imageRepository = imageRepository;
    }

    @Transactional
    public int saveBanner(BannerDtoRequest dto, ConnectionData data) {
        configService.setConfig(data.getCodeUser(), data.getIpSource());
        validator.validate(dto);
        Banner banner = bannerMapper.toEntity(dto);
        Banner savedBanner = bannerRepository.save(banner);
        return savedBanner.getCodeBanner();
    }

    @Transactional
    public void modifyBanner(int codeBanner, JsonMergePatch patch, ConnectionData data) throws JsonPatchException, JsonProcessingException {
        configService.setConfig(data.getCodeUser(), data.getIpSource());
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
    public void deleteBanner(int codeBanner, ConnectionData data) {
        configService.setConfig(data.getCodeUser(), data.getIpSource());
        Banner banner = bannerRepository.findById(codeBanner)
                        .orElseThrow(() -> new NoSuchElementException(
                                "Banner with id: " + codeBanner + " not found"));
        if(banner.getStatus() == 3){
            throw new BannerAlreadySentException(
                    "Новина вже відправлена(статус відправлено (3)). Видалення заборонено");
        }
        bannerRepository.delete(banner);
        removeAssociatedImages(codeBanner);
    }

    @Transactional
    public void removeAssociatedImages(int codeBanner) {
        List<Image> images = imageRepository.findByTypeValueAndCodeValue(10, codeBanner)
                .orElse(Collections.emptyList());
        imageRepository.deleteAll(images);
    }

    @Transactional
    public void moveBannerToAnotherGroup(int codeBanner, int codeGroupBanner, ConnectionData data) {
        configService.setConfig(data.getCodeUser(), data.getIpSource());
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
    public void copyBanner(int codeBanner, int targetCodeGroupBanner, ConnectionData data) {
        configService.setConfig(data.getCodeUser(), data.getIpSource());
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
    public void deleteBanners(BannersDeletionDto dto, ConnectionData data) {
        for(Integer codeBanner: dto.getCodeBanners()) {
            try {
                deleteBanner(codeBanner, data);
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

