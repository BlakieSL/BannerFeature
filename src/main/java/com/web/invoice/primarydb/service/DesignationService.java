package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.DesignationRepository;
import com.web.invoice.primarydb.dto.DesignationDto;
import com.web.invoice.primarydb.mapper.DesignationMapper;
import com.web.invoice.primarydb.model.Designation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DesignationService {
    private final DesignationMapper designationMapper;
    private final DesignationRepository designationRepository;

    public DesignationService (
            DesignationMapper designationMapper,
            DesignationRepository designationRepository
    ) {
        this.designationMapper = designationMapper;
        this.designationRepository = designationRepository;
    }

    public List<DesignationDto> getAllDesignationsByFieldName(String fieldName) {
        List<Designation> designations = designationRepository.findAllByFieldName(fieldName)
                .orElseThrow(() -> new NoSuchElementException(
                        "There are no designations with fieldName: " + fieldName));
        return designations.stream()
                .map(designationMapper::toDto)
                .collect(Collectors.toList());
    }
}
