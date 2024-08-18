package com.web.invoice.primarydb.mapper;

import com.web.invoice.primarydb.dto.DesignationDto;
import com.web.invoice.primarydb.model.Designation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DesignationMapper {
    DesignationDto toDto(Designation designation);
}
