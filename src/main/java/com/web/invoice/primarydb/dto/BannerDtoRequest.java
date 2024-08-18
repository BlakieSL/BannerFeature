package com.web.invoice.primarydb.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class BannerDtoRequest {
    private static final int TITLE_MAX_LENGTH = 70;
    @NotBlank
    @Size(max = TITLE_MAX_LENGTH)
    private String title;
    private String body;
    private LocalDateTime plannedDate;
    private short status;
    private String sendResult;
    @NotNull
    private Integer codeTypeBanner;
    private Integer externalId;
    private String note;
    @NotNull
    private Integer codeGroupBanner;
    private String clientTitle;
    private short channel;
    @NotNull
    private Set<Integer> groupClients;
    @NotNull
    private Set<Integer> singleClients;
    private String barcode;
    private String link;
}









