package com.web.invoice.primarydb.mapper;

import com.web.invoice.primarydb.dto.TypeBannerDto;
import com.web.invoice.primarydb.model.TypeBanner;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TypeBannerMapper {
    TypeBannerDto toDto(TypeBanner typeBanner);
}
