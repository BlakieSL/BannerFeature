package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.dto.ClientDto;
import com.web.invoice.primarydb.dto.ClientFindByBarcodeDto;
import com.web.invoice.primarydb.dto.ClientFindByPhoneDto;
import com.web.invoice.primarydb.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(
            final ClientService clientService
    ) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<ClientDto>> getAllClients() {
        List<ClientDto> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    @PostMapping("/find-by-phone")
    public ResponseEntity<ClientDto> findByPhone(@RequestBody ClientFindByPhoneDto dto) {
        ClientDto client = clientService.findByPhone(dto);
        return ResponseEntity.ok(client);
    }

    @PostMapping("/find-by-barcodes")
    public ResponseEntity<List<ClientDto>> findByBarcodes(@RequestBody ClientFindByBarcodeDto dto) {
        List<ClientDto> clients = clientService.findByBarcodes(dto);
        return ResponseEntity.ok(clients);
    }
}
