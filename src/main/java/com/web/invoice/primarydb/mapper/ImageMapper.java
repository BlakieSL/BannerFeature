package com.web.invoice.primarydb.mapper;

import com.web.invoice.primarydb.dto.ImageDto;
import com.web.invoice.primarydb.dto.ImageDtoRequest;
import com.web.invoice.primarydb.exception.FileProcessingException;
import com.web.invoice.primarydb.model.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageDto toDto(Image image);

    @Mapping(target = "image", source = "imageFile", qualifiedByName = "mapImageFile")
    @Mapping(target = "typeUsage", ignore = true)
    @Mapping(target = "num", ignore = true)
    @Mapping(target = "codeImage", ignore = true)
    Image toEntity(ImageDtoRequest dto);

    @Named("mapImageFile")
    default byte[] mapImageFile(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new FileProcessingException("Failed to process the image file", e);
        }
    }
}
