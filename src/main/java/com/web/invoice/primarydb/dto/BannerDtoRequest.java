package com.web.invoice.primarydb.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BannerDtoRequest {
    private static final int TITLE_MAX_LENGTH = 70;
    @NotNull
    @Size(max = TITLE_MAX_LENGTH)
    private String title;
    private String body;
    private LocalDateTime plannedDate;
    private short status; // коли створюємо банер повинна бути можливість вибрати тільки (2)-готово до відправки,
    // в інших випадках статус вибирати не буде можливості і він автоматично буде створений (0)-чернетка
    private String sendResult;
    @NotNull
    private Integer codeTypeBanner;
    private Integer externalId;
    private String note;
    @NotNull
    private Integer codeGroupBanner;
    private Set<Integer> groupClients;
    private Set<Integer> singleClients;
}









