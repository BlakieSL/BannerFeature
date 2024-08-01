package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.GroupBannerRepository;
import com.web.invoice.primarydb.dao.TypeBannerRepository;
import com.web.invoice.primarydb.dto.BannerDetailedDto;
import com.web.invoice.primarydb.dto.BannerDtoRequest;
import com.web.invoice.primarydb.dto.BannerSummaryDto;
import com.web.invoice.primarydb.model.Banner;
import com.web.invoice.primarydb.model.GroupBanner;
import com.web.invoice.primarydb.model.SetBanner;
import com.web.invoice.primarydb.model.TypeBanner;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.Set;

@Mapper(componentModel = "spring")
public abstract class BannerMapper {
    @Autowired
    private TypeBannerRepository typeBannerRepository;

    @Autowired
    private GroupBannerRepository groupBannerRepository;

    @Mapping(source = "codeTypeBanner", target = "typeBanner", qualifiedByName = "mapTypeBanner")
    @Mapping(source = "codeGroupBanner", target = "groupBanner", qualifiedByName = "mapGroupBanner")
    @Mapping(target = "dateCreate", ignore = true)
    @Mapping(target = "dateBegin", ignore = true)
    @Mapping(target = "dateEnd", ignore = true)
    @Mapping(target = "signActivity", ignore = true)
    @Mapping(target = "codeBanner", ignore = true)
    public abstract Banner toEntity(BannerDtoRequest dto);

    @AfterMapping
    protected void setDefaultValues(@MappingTarget Banner banner, BannerDtoRequest dto) {
        banner.setDateCreate(LocalDate.now());
        banner.setDateBegin(LocalDateTime.now());
        banner.setDateEnd(LocalDateTime.now().plusDays(10));
        banner.setSignActivity((short) 1);

        Set<SetBanner> setBanners = new HashSet<>();

        dto.getGroupClients().forEach(groupId -> {
            SetBanner setBanner = new SetBanner();
            setBanner.setBanner(banner);
            setBanner.setCodeValue(groupId);
            setBanner.setTypeValue((short) 1);
            setBanners.add(setBanner);
        });

        dto.getSingleClients().forEach(clientId -> {
            SetBanner setBanner = new SetBanner();
            setBanner.setBanner(banner);
            setBanner.setCodeValue(clientId);
            setBanner.setTypeValue((short) 0);
            setBanners.add(setBanner);
        });

        banner.getSetBanners().addAll(setBanners);
    }

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    @Mapping(source = "groupBanner", target = "codeGroupBanner", qualifiedByName = "mapGroupBannerToCode")
    public abstract BannerDetailedDto toDetailedDto(Banner banner);

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    public abstract BannerSummaryDto toSummaryDto(Banner banner);

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    @Mapping(source = "groupBanner", target = "codeGroupBanner", qualifiedByName = "mapGroupBannerToCode")
    public abstract BannerDtoRequest toRequestDto(Banner banner);

    @Mapping(target = "typeBanner", ignore = true)
    @Mapping(target = "groupBanner", ignore = true)
    @Mapping(target = "dateCreate", ignore = true)
    @Mapping(target = "dateBegin", ignore = true)
    @Mapping(target = "dateEnd", ignore = true)
    @Mapping(target = "signActivity", ignore = true)
    @Mapping(target = "codeBanner", ignore = true)
    public abstract void updateEntityFromDto(BannerDtoRequest dto, @MappingTarget Banner entity);

    @Named("mapTypeBanner")
    TypeBanner mapTypeBanner(Integer codeTypeBanner) {
        return typeBannerRepository.findById(codeTypeBanner)
                .orElseThrow(() -> new NoSuchElementException("Banner type with id: " + codeTypeBanner + " not found"));
    }

    @Named("mapGroupBanner")
    GroupBanner mapGroupBanner(Integer codeGroupBanner) {
        return groupBannerRepository.findById(codeGroupBanner)
                .orElseThrow(() -> new NoSuchElementException("Banner group with id: " + codeGroupBanner + " not found"));
    }

    @Named("mapTypeBannerToCode")
    Integer mapTypeBannerToCode(TypeBanner typeBanner) {
        return typeBanner != null ? typeBanner.getCodeTypeBanner() : null;
    }

    @Named("mapGroupBannerToCode")
    Integer mapGroupBannerToCode(GroupBanner groupBanner) {
        return groupBanner != null ? groupBanner.getCodeGroupBanner() : null;
    }
}
