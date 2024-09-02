package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.BarcodeClientRepository;
import com.web.invoice.primarydb.dao.ClientRepository;
import com.web.invoice.primarydb.dto.ClientDto;
import com.web.invoice.primarydb.dto.ClientFindByBarcodeDto;
import com.web.invoice.primarydb.dto.ClientFindByPhoneDto;
import com.web.invoice.primarydb.mapper.ClientMapper;
import com.web.invoice.primarydb.model.BarcodeClient;
import com.web.invoice.primarydb.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Value("${is-1021}")
    private Boolean is1021;
    private final ClientMapper clientMapper;
    private final BarcodeClientRepository barcodeClientRepository;
    private final ClientRepository clientRepository;

    @Autowired
    NamedParameterJdbcTemplate jt;

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

/*
    public ClientDto findByPhone(ClientFindByPhoneDto dto) {
        Client client = clientRepository.findByPhone(dto.getPhone())
                .orElseThrow(() -> new NoSuchElementException(
                        "Client with phone: " + dto.getPhone() + " not found"));

        return clientMapper.toDto(client);
    }
 */
    public ClientDto findTest(ClientFindByPhoneDto dto) {
        String query = is1021
                ? "select c.*,\n" +
                "       cp.value_property as phone,\n" +
                "       null              as id_external,\n" +
                "       null              as email,\n" +
                "       null              as address,\n" +
                "       null              as add_info\n" +
                "from \n" +
                "    pos.client c\n" +
                "inner join\n" +
                "    pos.client_property cp \n" +
                "    on c.code_client = cp.code_client\n" +
                "where \n" +
                "    cp.code_property = 2\n" +
                "    and cp.value_property = :phone"
                : "select * from pos.client where right(phone, 12) = right(:phone, 12)\n";

        MapSqlParameterSource param = new MapSqlParameterSource();
        param.addValue("phone", dto.getPhone());

        Client client = jt.query(query, param, new BeanPropertyRowMapper<>(Client.class))
                .stream().findFirst().orElse(null);

        if (client == null) {
            throw new NoSuchElementException("Client with phone: " + dto.getPhone() + " not found");
        }

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
