package com.web.invoice.primarydb.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageDto {
    private Integer codeImage;
    private Integer typeValue;
    private Integer codeValue;
    private Integer num;
    private byte[] image;
    private String description;
    private Integer typeRef;
}
