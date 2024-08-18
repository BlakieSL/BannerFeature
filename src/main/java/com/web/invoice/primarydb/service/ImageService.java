package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.ImageRepository;
import com.web.invoice.primarydb.dto.ImageDto;
import com.web.invoice.primarydb.dto.ImageDtoRequest;
import com.web.invoice.primarydb.mapper.ImageMapper;
import com.web.invoice.primarydb.model.Image;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private final ValidationHelper validator;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;

    public ImageService(
            ValidationHelper validator,
            ImageMapper imageMapper,
            ImageRepository imageRepository
    ) {
        this.validator = validator;
        this.imageMapper = imageMapper;
        this.imageRepository = imageRepository;
    }

    @Transactional
    public void saveImage(ImageDtoRequest dto) {
        validator.validate(dto);
        //Image image = imageMapper.toEntity(dto);
        Image image = new Image();

        try {
            image.setImage( dto.getImageFile().getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        image.setTypeValue( dto.getTypeValue() );
        image.setCodeValue( dto.getCodeValue() );
        image.setDescription( dto.getDescription() );
        image.setTypeRef( dto.getTypeRef() );
        Integer maxNum = imageRepository.findTopByTypeValueAndCodeValueOrderByNumDesc(dto.getTypeValue(), dto.getCodeValue())
                .orElse(1);
        image.setNum(maxNum);
        imageRepository.save(image);
    }

    public List<ImageDto> getAllImagesByTypeValue(int typeValue) {
        List<Image> images = imageRepository.findByTypeValue(typeValue)
                .orElseThrow(() -> new NoSuchElementException(
                        "no images found"));

        return images.stream()
                .map(imageMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ImageDto> getAllImagesByTypeValueAndCodeValue(int typeValue, int codeValue) {
        List<Image> images = imageRepository.findByTypeValueAndCodeValue(typeValue, codeValue)
                .orElseThrow(() -> new NoSuchElementException(
                        "no images found"));

        return images.stream()
                .map(imageMapper::toDto)
                .collect(Collectors.toList());
    }
}
