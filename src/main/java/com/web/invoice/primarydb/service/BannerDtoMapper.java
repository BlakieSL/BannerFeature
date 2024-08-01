package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.GroupBannerRepository;
import com.web.invoice.primarydb.dao.TypeBannerRepository;
import com.web.invoice.primarydb.dto.BannerDtoRequest;
import com.web.invoice.primarydb.dto.BannerDetailedDto;
import com.web.invoice.primarydb.dto.BannerSummaryDto;
import com.web.invoice.primarydb.model.Banner;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
public class BannerDtoMapper {
    private final TypeBannerRepository typeBannerRepository;
    private final GroupBannerRepository groupBannerRepository;

    public BannerDtoMapper(
            TypeBannerRepository typeBannerRepository,
            GroupBannerRepository groupBannerRepository
    ) {
        this.typeBannerRepository = typeBannerRepository;
        this.groupBannerRepository = groupBannerRepository;
    }

    public BannerSummaryDto map(Banner banner) {
        return new BannerSummaryDto(
                banner.getCodeBanner(),
                banner.getDateCreate(),
                banner.getTitle(),
                banner.getTypeBanner().getCodeTypeBanner(),
                banner.getPlannedDate(),
                banner.getStatus()
        );
    }

    public BannerDetailedDto mapDetailed(Banner banner) {
        return new BannerDetailedDto(
                banner.getCodeBanner(),
                banner.getTitle(),
                banner.getBody(),
                banner.getPlannedDate(),
                banner.getStatus(),
                banner.getSendResult(),
                banner.getTypeBanner().getCodeTypeBanner(),
                banner.getExternalId(),
                banner.getNote(),
                banner.getDateCreate(),
                banner.getGroupBanner().getCodeGroupBanner()
        );
    }

    public Banner map(BannerDtoRequest dto) {
        Banner banner = new Banner();
        banner.setTitle(dto.getTitle());
        banner.setBody(dto.getBody());
        banner.setPlannedDate(dto.getPlannedDate());
        banner.setStatus(dto.getStatus());
        banner.setSendResult(dto.getSendResult());
        banner.setExternalId(dto.getExternalId());
        banner.setNote(dto.getNote());
        banner.setTypeBanner(typeBannerRepository
                .findById(dto.getCodeTypeBanner())
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner type with id: " + dto.getCodeTypeBanner() + " not found")));
        banner.setGroupBanner(groupBannerRepository
                .findById(dto.getCodeGroupBanner())
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner group with id: " + dto.getCodeGroupBanner() + " not found")));

        banner.setDateCreate(LocalDate.now());
        banner.setDateBegin(LocalDateTime.now());
        banner.setDateEnd(LocalDateTime.now().plusDays(10));
        banner.setSignActivity((short) 1);
        banner.setCodeBanner(new Random().nextInt(100000));

        return banner;
    }

    public BannerDtoRequest mapRequest(Banner banner) {
        return new BannerDtoRequest(
                banner.getTitle(),
                banner.getBody(),
                banner.getPlannedDate(),
                banner.getStatus(),
                banner.getSendResult(),
                banner.getTypeBanner().getCodeTypeBanner(),
                banner.getExternalId(),
                banner.getNote(),
                banner.getGroupBanner().getCodeGroupBanner()
        );
    }
}