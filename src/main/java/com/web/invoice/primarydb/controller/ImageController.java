package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.dto.ImageDto;
import com.web.invoice.primarydb.dto.ImageDtoRequest;
import com.web.invoice.primarydb.dto.MultipleImagesDtoRequest;
import com.web.invoice.primarydb.exception.ValidationException;
import com.web.invoice.primarydb.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path = "/api/images")
public class ImageController {
    private final ImageService imageService;

    public ImageController(
            ImageService imageService
    ) {
        this.imageService = imageService;
    }

    @GetMapping("/type/{typeValue}")
    public ResponseEntity<List<ImageDto>> getAllImagesByTypeValue (@PathVariable int typeValue) {
        List<ImageDto> images = imageService.getAllImagesByTypeValue(typeValue);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/type/{typeValue}/code/{codeValue}")
    public ResponseEntity<List<ImageDto>> getAllImagesByTypeValueAndCodeValue(
            @PathVariable int typeValue,
            @PathVariable int codeValue) {
        List<ImageDto> images = imageService.getAllImagesByTypeValueAndCodeValue(typeValue, codeValue);
        return ResponseEntity.ok(images);
    }

    @PostMapping()
    public ResponseEntity<Void> createImage(@ModelAttribute @Valid ImageDtoRequest dto) {
        imageService.saveImage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/multiple")
    public ResponseEntity<Void> createMultipleImages(@ModelAttribute @Valid MultipleImagesDtoRequest dto) {
        imageService.saveMultipleImages(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
