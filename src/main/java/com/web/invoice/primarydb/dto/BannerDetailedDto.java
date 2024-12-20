package com.web.invoice.primarydb.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class BannerDetailedDto {
    private Integer codeBanner;
    private String title;
    private String body;
    private LocalDateTime plannedDate;
    private short status;
    private String sendResult;
    private Integer codeTypeBanner;
    private Integer externalId;
    private String note;
    private LocalDate dateCreate;
    private Integer codeGroupBanner;
    private String clientTitle;
    private short channel;
    private String barcode;
    private String link;
    private Set<SimplifiedGroupClientDto> groupClients;
    private Set<SimplifiedClientDto> singleClients;
}
