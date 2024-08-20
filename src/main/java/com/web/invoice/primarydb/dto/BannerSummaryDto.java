package com.web.invoice.primarydb.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class BannerSummaryDto {
    private Integer codeBanner;
    private LocalDate dateCreate;
    private String title;
    private Integer codeTypeBanner;
    private LocalDateTime plannedDate;
    private short status;
    private Integer lastUserCode;
    private String lastUserFio;
}
