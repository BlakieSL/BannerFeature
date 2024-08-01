package com.web.invoice.primarydb.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BannerDtoRequest {
    private static final int TITLE_MAX_LENGTH = 70;
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
}
