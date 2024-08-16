package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.BarcodeClientRepository;
import com.web.invoice.primarydb.dao.ClientRepository;
import com.web.invoice.primarydb.dto.ClientDto;
import com.web.invoice.primarydb.dto.ClientFindByBarcodeDto;
import com.web.invoice.primarydb.dto.ClientFindByPhoneDto;
import com.web.invoice.primarydb.mapper.ClientMapper;
import com.web.invoice.primarydb.model.BarcodeClient;
import com.web.invoice.primarydb.model.Client;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ClientService {
    private final ClientMapper clientMapper;
    private final BarcodeClientRepository barcodeClientRepository;
    private final ClientRepository clientRepository;

    public ClientService(
            ClientMapper clientMapper,
            BarcodeClientRepository barcodeClientRepository,
            ClientRepository clientRepository
    ) {
        this.clientMapper = clientMapper;
        this.barcodeClientRepository = barcodeClientRepository;
        this.clientRepository = clientRepository;
    }

    public List<ClientDto> getAllClients() {
        List<Client> clients = clientRepository.findAll();

        return clients.stream()
                .map(clientMapper::toDto)
                .collect(Collectors.toList());
    }

    public ClientDto getClientById(int id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        "Client with id: " + id + "not found"));
        return clientMapper.toDto(client);
    }

    public ClientDto findByPhone(ClientFindByPhoneDto dto) {
        Client client =  clientRepository.findByPhone(dto.getPhone())
                .orElseThrow(() -> new NoSuchElementException(
                        "Client with phone: " + dto.getPhone() + " not found"));

        return clientMapper.toDto(client);
    }

    public List<ClientDto> findByBarcodes(ClientFindByBarcodeDto dto) {
        List<String> barcodeList = Arrays.stream(dto.getBarcodes().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        List<BarcodeClient> barcodeClients = barcodeClientRepository.findByBarcodes(barcodeList)
                .orElseThrow(() -> new NoSuchElementException("no barcodeClients found"));

        List<Client> clients = barcodeClients.stream()
                .map(BarcodeClient::getClient)
                .distinct()
                .collect(Collectors.toList());

        return clients.stream()
                .map(clientMapper::toDto)
                .collect(Collectors.toList());
    }
}
