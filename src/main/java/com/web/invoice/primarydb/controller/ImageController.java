package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.dto.ImageDto;
import com.web.invoice.primarydb.dto.ImageDtoRequest;
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

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> createImage(
            @RequestParam("typeValue") Integer typeValue,
            @RequestParam("codeValue") Integer codeValue,
            @RequestParam("typeRef") Integer typeRef,
            @RequestParam("description") String description,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        ImageDtoRequest dto = new ImageDtoRequest();
        dto.setTypeValue(typeValue);
        dto.setCodeValue(codeValue);
        dto.setTypeRef(typeRef);
        dto.setDescription(description);
        dto.setImageFile(imageFile);

        imageService.saveImage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
