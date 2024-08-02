package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dto.ClientDto;
import com.web.invoice.primarydb.model.Client;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDto toDto(Client client);
}
