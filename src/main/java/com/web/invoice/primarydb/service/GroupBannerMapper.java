package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dto.GroupBannerDto;
import com.web.invoice.primarydb.dto.GroupBannerDtoRequest;
import com.web.invoice.primarydb.model.GroupBanner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GroupBannerMapper {

    GroupBannerDtoRequest toRequestDto(GroupBanner groupBanner);
    GroupBannerDto toDto(GroupBanner groupBanner);

    @Mapping(target = "codeGroupBanner", ignore = true)
    @Mapping(target = "banners", ignore = true)
    GroupBanner toEntity(GroupBannerDtoRequest dto);

    @Mapping(target = "codeGroupBanner", ignore = true)
    @Mapping(target = "banners", ignore = true)
    void updateEntityFromDto(GroupBannerDtoRequest dto, @MappingTarget GroupBanner entity);
}

