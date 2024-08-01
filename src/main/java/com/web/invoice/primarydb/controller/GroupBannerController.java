package com.web.invoice.primarydb.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.dto.GroupBannerDtoRequest;
import com.web.invoice.primarydb.dto.GroupBannerDto;
import com.web.invoice.primarydb.exception.ValidationException;
import com.web.invoice.primarydb.service.GroupBannerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/group-banners")
public class GroupBannerController {
    private final GroupBannerService groupBannerService;
    public GroupBannerController(
            GroupBannerService groupBannerService
    ) {
        this.groupBannerService = groupBannerService;
    }

    @GetMapping
    public ResponseEntity<List<GroupBannerDto>> getAllGroupBanners() {
        List<GroupBannerDto> groups = groupBannerService.getAllGroupBanner();
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<Void> createGroupBanner(@Valid @RequestBody GroupBannerDtoRequest dto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        groupBannerService.saveGroupBanner(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupBanner(@PathVariable int id) {
        groupBannerService.deleteGroupBanner(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> modifyGroupBannerById(@PathVariable int id,
                                                      @Valid @RequestBody JsonMergePatch patch, BindingResult bindingResult) throws JsonPatchException, JsonProcessingException {
        if(bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        groupBannerService.modifyGroupBanner(id,patch);
        return ResponseEntity.noContent().build();
    }
}
