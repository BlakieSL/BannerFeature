package com.web.invoice.primarydb.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
public class MultipleImagesDtoRequest {
    @NotNull
    private Integer typeValue;

    @NotNull
    private Integer codeValue;

    @NotNull
    private Integer typeRef;

    @Size(max = 250)
    private String description;

    @NotNull
    private List<MultipartFile> imageFiles;
}