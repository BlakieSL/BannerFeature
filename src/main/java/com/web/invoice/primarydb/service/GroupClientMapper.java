package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dto.GroupClientDto;
import com.web.invoice.primarydb.model.GroupClient;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GroupClientMapper {
    GroupClientDto toDto(GroupClient groupClient);
}
