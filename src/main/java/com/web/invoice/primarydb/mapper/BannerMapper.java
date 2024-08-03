package com.web.invoice.primarydb.mapper;

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
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class BannerMapper {
    @Autowired
    private TypeBannerRepository typeBannerRepository;

    @Autowired
    private GroupBannerRepository groupBannerRepository;

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    @Mapping(source = "groupBanner", target = "codeGroupBanner", qualifiedByName = "mapGroupBannerToCode")
    @Mapping(target = "groupClients", ignore = true)
    @Mapping(target = "singleClients", ignore = true)
    public abstract BannerDetailedDto toDetailedDto(Banner banner);

    @AfterMapping
    protected void mapClientsToDetailedDto(@MappingTarget BannerDetailedDto dto, Banner banner) {
        Set<Integer> groupClients = getClients(banner, (short) 1);
        Set<Integer> singleClients = getClients(banner, (short) 0);

        dto.setGroupClients(groupClients);
        dto.setSingleClients(singleClients);
    }

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    public abstract BannerSummaryDto toSummaryDto(Banner banner);

    @Mapping(source = "codeTypeBanner", target = "typeBanner", qualifiedByName = "mapTypeBanner")
    @Mapping(source = "codeGroupBanner", target = "groupBanner", qualifiedByName = "mapGroupBanner")
    @Mapping(target = "dateCreate", ignore = true)
    @Mapping(target = "dateBegin", ignore = true)
    @Mapping(target = "dateEnd", ignore = true)
    @Mapping(target = "signActivity", ignore = true)
    @Mapping(target = "codeBanner", ignore = true)
    @Mapping(target = "setBanners", ignore = true)
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
    @Mapping(target = "groupClients", ignore = true)
    @Mapping(target = "singleClients", ignore = true)
    public abstract BannerDtoRequest toRequestDto(Banner banner);

    @AfterMapping
    protected void mapClients(@MappingTarget BannerDtoRequest dto, Banner banner) {
        Set<Integer> groupClients = getClients(banner, (short) 1);
        Set<Integer> singleClients = getClients(banner, (short) 0);

        dto.setGroupClients(groupClients);
        dto.setSingleClients(singleClients);
    }

    @Mapping(target = "typeBanner", ignore = true)
    @Mapping(target = "groupBanner", ignore = true)
    @Mapping(target = "dateCreate", ignore = true)
    @Mapping(target = "dateBegin", ignore = true)
    @Mapping(target = "dateEnd", ignore = true)
    @Mapping(target = "signActivity", ignore = true)
    @Mapping(target = "codeBanner", ignore = true)
    @Mapping(target = "setBanners", ignore = true)
    public abstract void updateEntityFromDto(BannerDtoRequest dto, @MappingTarget Banner banner);

    @AfterMapping
    protected void updateSetBanners(@MappingTarget Banner banner, BannerDtoRequest dto) {
        Set<Integer> newGroupClients = dto.getGroupClients();
        Set<Integer> newSingleClients = dto.getSingleClients();

        Set<SetBanner> currentSetBanners = banner.getSetBanners();
        Set<SetBanner> newSetBanners = new HashSet<>();

        newGroupClients.forEach(groupId -> {
            SetBanner setBanner = new SetBanner();
            setBanner.setBanner(banner);
            setBanner.setCodeValue(groupId);
            setBanner.setTypeValue((short) 1);
            newSetBanners.add(setBanner);
        });

        newSingleClients.forEach(clientId -> {
            SetBanner setBanner = new SetBanner();
            setBanner.setBanner(banner);
            setBanner.setCodeValue(clientId);
            setBanner.setTypeValue((short) 0);
            newSetBanners.add(setBanner);
        });

        // Debug: Print current and new setBanners before updating
        System.out.println("Current SetBanners:");
        currentSetBanners.forEach(setBanner ->
                System.out.println("Type: " + setBanner.getTypeValue() + ", Code: " + setBanner.getCodeValue()));

        System.out.println("New SetBanners:");
        newSetBanners.forEach(setBanner ->
                System.out.println("Type: " + setBanner.getTypeValue() + ", Code: " + setBanner.getCodeValue()));

        currentSetBanners.removeIf(setBanner -> !newSetBanners.contains(setBanner));
        currentSetBanners.addAll(newSetBanners);

        // Debug: Print current setBanners after updating
        System.out.println("Updated Current SetBanners:");
        currentSetBanners.forEach(setBanner ->
                System.out.println("Type: " + setBanner.getTypeValue() + ", Code: " + setBanner.getCodeValue()));
    }


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

    private Set<Integer> getClients(Banner banner, short typeValue) {
        return banner.getSetBanners().stream()
                .filter(setBanner -> setBanner.getTypeValue() == typeValue)
                .map(SetBanner::getCodeValue)
                .collect(Collectors.toSet());
    }
}
