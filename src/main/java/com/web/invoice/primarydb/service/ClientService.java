package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.ClientRepository;
import com.web.invoice.primarydb.dto.ClientDto;
import com.web.invoice.primarydb.dto.ClientFindByBarcodeDto;
import com.web.invoice.primarydb.dto.ClientFindByPhoneDto;
import com.web.invoice.primarydb.dto.ClientFindDto;
import com.web.invoice.primarydb.mapper.ClientMapper;
import com.web.invoice.primarydb.model.Client;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ClientService {
    private final ClientMapper clientMapper;
    private final ClientRepository clientRepository;

    public ClientService(
            final ClientMapper clientMapper,
            final ClientRepository clientRepository
    ) {
        this.clientMapper = clientMapper;
        this.clientRepository = clientRepository;
    }

    public List<ClientDto> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream()
                .map(clientMapper::toDto)
                .collect(Collectors.toList());
    }

    public ClientDto findByPhone(ClientFindByPhoneDto dto) {
        Client client =  clientRepository.findByPhone(dto.getPhone())
                .orElseThrow(() -> new NoSuchElementException(
                        "Client with phone: " + dto.getPhone() + " not found"));
        return clientMapper.toDto(client);
    }

    public List<ClientDto> findByBarcode(ClientFindByBarcodeDto dto) {

    }
}
