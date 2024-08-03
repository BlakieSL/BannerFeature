package com.web.invoice.primarydb.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.dto.BannerDtoRequest;
import com.web.invoice.primarydb.dto.BannerDetailedDto;
import com.web.invoice.primarydb.dto.BannerFilterDto;
import com.web.invoice.primarydb.dto.BannerSummaryDto;
import com.web.invoice.primarydb.exception.ValidationException;
import com.web.invoice.primarydb.service.BannerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/banners")
public class BannerController {
    private final BannerService bannerService;

    public BannerController(
            final BannerService bannerService
    )  {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<BannerSummaryDto>> getAllBanners() {
        List<BannerSummaryDto> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BannerDetailedDto> getBannerById(@PathVariable int id) {
        BannerDetailedDto banner = bannerService.getBannerDetails(id);
        return ResponseEntity.ok(banner);
    }

    @PostMapping
    public ResponseEntity<Void> createBanner(@Valid @RequestBody BannerDtoRequest dto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new ValidationException(bindingResult);
        }
        bannerService.saveBanner(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable int id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> modifyBannerById(@PathVariable int id,
                                                 @Valid @RequestBody JsonMergePatch patch, BindingResult bindingResult) throws JsonPatchException, JsonProcessingException {
        if(bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        bannerService.modifyBanner(id, patch);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/move/{codeGroupBanner}")
    public ResponseEntity<Void> moveBannerToAnotherGroup(@PathVariable int id, @PathVariable int codeGroupBanner) {
        bannerService.moveBannerToAnotherGroup(id, codeGroupBanner);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/filter")
    public ResponseEntity<List<BannerSummaryDto>> getAllBannersFiltered(@RequestBody BannerFilterDto dto) {
        List<BannerSummaryDto> banners = bannerService.getAllBannersFiltered(dto);
        return ResponseEntity.ok(banners);
    }
}
