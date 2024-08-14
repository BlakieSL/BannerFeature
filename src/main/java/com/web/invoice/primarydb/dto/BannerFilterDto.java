package com.web.invoice.primarydb.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerFilterDto {
    private Integer codeGroupBanner;
    private Integer codeTypeBanner;
    private Short status;
}
