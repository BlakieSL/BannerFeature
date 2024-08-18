package com.web.invoice.primarydb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class GroupBannerDtoRequest {
    @NotNull
    private String name;
}
