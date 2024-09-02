package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.BannerRepository;
import com.web.invoice.primarydb.dao.ImageRepository;
import com.web.invoice.primarydb.dto.ImageDto;
import com.web.invoice.primarydb.dto.ImageDtoRequest;
import com.web.invoice.primarydb.dto.MultipleImagesDeleteDto;
import com.web.invoice.primarydb.dto.MultipleImagesDtoRequest;
import com.web.invoice.primarydb.exception.BannerAlreadySentException;
import com.web.invoice.primarydb.mapper.ImageMapper;
import com.web.invoice.primarydb.model.Banner;
import com.web.invoice.primarydb.model.Image;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private final ValidationHelper validator;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    private final BannerRepository bannerRepository;

    public ImageService(
            ValidationHelper validator,
            ImageMapper imageMapper,
            ImageRepository imageRepository,
            BannerRepository bannerRepository) {
        this.validator = validator;
        this.imageMapper = imageMapper;
        this.imageRepository = imageRepository;
        this.bannerRepository = bannerRepository;
    }

    @Transactional
    public void saveImage(ImageDtoRequest dto) {
        Banner banner = bannerRepository.findById(dto.getCodeValue())
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + dto.getCodeValue() + " not found"));
        if(banner.getStatus() == 3){
            throw new BannerAlreadySentException(
                    "Новина вже відправлена(статус відправлено (3)). Додавання нових зображень заборонено.");
        }

        validator.validate(dto);
        Image image = imageMapper.toEntity(dto);
        Integer maxNum = imageRepository.findTopNumByTypeValueAndCodeValueOrderByNumDesc(dto.getTypeValue(), dto.getCodeValue()) + 1;
        image.setNum(maxNum);
        imageRepository.save(image);
    }

    @Transactional
    public void saveMultipleImages(MultipleImagesDtoRequest dto) {
        Banner banner = bannerRepository.findById(dto.getCodeValue())
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + dto.getCodeValue() + " not found"));
        if(banner.getStatus() == 3){
            throw new BannerAlreadySentException(
                    "Новина вже відправлена(статус відправлено (3)). Додавання нових зображень заборонено.");
        }

        validator.validate(dto);

        ImageDtoRequest singleDto = new ImageDtoRequest();
        singleDto.setTypeValue(dto.getTypeValue());
        singleDto.setCodeValue(dto.getCodeValue());
        singleDto.setTypeRef(dto.getTypeRef());
        singleDto.setDescription(dto.getDescription());

        for (MultipartFile imageFile : dto.getImageFiles()) {
            singleDto.setImageFile(imageFile);
            saveImage(singleDto);
        }
    }

    @Transactional
    public void deleteImage(int codeImage) {
        Image image = imageRepository.findById(codeImage)
                .orElseThrow(() -> new NoSuchElementException(
                        "Image with id: " + codeImage + " not found"));

        Banner banner = bannerRepository.findById(image.getCodeValue())
                .orElseThrow(() -> new NoSuchElementException(
                        "Banner with id: " + image.getCodeValue() + " not found"));
        if(banner.getStatus() == 3){
            throw new BannerAlreadySentException(
                    "Новина вже відправлена(статус відправлено (3)). Видалення зображень заборонено");
        }

        imageRepository.delete(image);
    }

    @Transactional
    public void deleteMultipleImages(MultipleImagesDeleteDto dto) {
        for (Integer codeImage : dto.getCodeImages()) {
            deleteImage(codeImage);
        }
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
