package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.dto.DesignationDto;
import com.web.invoice.primarydb.service.DesignationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/designations")
public class DesignationController {
    private final DesignationService designationService;

    public DesignationController(
            DesignationService designationService
    ) {
        this.designationService = designationService;
    }

    @GetMapping("/{fieldName}")
    public ResponseEntity<List<DesignationDto>> getAllDesignationsByFieldName(@PathVariable String fieldName) {
        List<DesignationDto> designations =  designationService.getAllDesignationsByFieldName(fieldName);
        return ResponseEntity.ok(designations);
    }
}
