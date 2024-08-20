package com.web.invoice.primarydb.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.dto.*;
import com.web.invoice.primarydb.exception.ValidationException;
import com.web.invoice.primarydb.model.ConnectionData;
import com.web.invoice.primarydb.model.UserPos;
import com.web.invoice.primarydb.service.BannerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/banners")
public class BannerController {
    private final BannerService bannerService;
    private final HttpServletRequest request;

    public BannerController(
            BannerService bannerService,
            HttpServletRequest request)  {
        this.bannerService = bannerService;
        this.request = request;
    }

    private ConnectionData getConnectionData() {
        ConnectionData connectionData = new ConnectionData();
        connectionData.setCodeUser(getCodeUser());
        connectionData.setIpSource(request.getRemoteHost());
        return connectionData;
    }

    @RequestMapping("code-user")
    public String getCodeUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return String.valueOf(((UserPos) auth.getPrincipal()).getCodeUser());
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

    @GetMapping("/group/{codeGroupBanner}")
    public ResponseEntity<List<BannerSummaryDto>> getAllBannersByGroupBanner(@PathVariable int codeGroupBanner) {
        List<BannerSummaryDto> banners = bannerService.getAllBannersByGroup(codeGroupBanner);
        return ResponseEntity.ok(banners);
    }

    @PostMapping
    public ResponseEntity<Integer> createBanner(@Valid @RequestBody BannerDtoRequest dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        int codeBanner = bannerService.saveBanner(dto, getConnectionData());
        return ResponseEntity.status(HttpStatus.CREATED).body(codeBanner);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable int id) {
        bannerService.deleteBanner(id, getConnectionData());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> modifyBannerById(@PathVariable int id,
                                                 @Valid @RequestBody JsonMergePatch patch, BindingResult bindingResult) throws JsonPatchException, JsonProcessingException {
        if(bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        bannerService.modifyBanner(id, patch, getConnectionData());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/move/{codeGroupBanner}")
    public ResponseEntity<Void> moveBannerToAnotherGroup(@PathVariable int id, @PathVariable int codeGroupBanner) {
        bannerService.moveBannerToAnotherGroup(id, codeGroupBanner, getConnectionData());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/filter")
    public ResponseEntity<List<BannerSummaryDto>> getAllBannersFiltered(@RequestBody BannerFilterDto dto) {
        List<BannerSummaryDto> banners = bannerService.getAllBannersFiltered(dto);
        return ResponseEntity.ok(banners);
    }

    @PostMapping("/{id}/copy/{targetCodeGroupBanner}")
    public ResponseEntity<Void> copyBanner(@PathVariable int id, @PathVariable int targetCodeGroupBanner) {
        bannerService.copyBanner(id, targetCodeGroupBanner, getConnectionData());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteBanners(@RequestBody BannersDeletionDto dto) {
        bannerService.deleteBanners(dto, getConnectionData());
        return ResponseEntity.noContent().build();
    }
}