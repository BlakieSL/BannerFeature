package com.web.invoice.primarydb.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class ImageDtoRequest {
    @NotNull
    private Integer typeValue;
    @NotNull
    private Integer codeValue;
    @NotNull
    private Integer typeRef;
    @Size(max = 250)
    private String description;
    @NotNull
    private MultipartFile imageFile;
}
