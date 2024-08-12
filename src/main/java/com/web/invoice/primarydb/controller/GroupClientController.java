package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.dto.GroupClientDto;
import com.web.invoice.primarydb.model.GroupClient;
import com.web.invoice.primarydb.service.GroupClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/group-clients")
public class GroupClientController {
    private final GroupClientService groupClientService;

    public GroupClientController(
            final GroupClientService groupClientService
    ) {
        this.groupClientService = groupClientService;
    }

    @GetMapping
    public ResponseEntity<List<GroupClientDto>> getAllGroupClients() {
        List<GroupClientDto> groups = groupClientService.getAllGroupClients();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupClientDto> getGroupClientById(@PathVariable int id) {
        GroupClientDto group = groupClientService.getGroupClientById(id);
        return ResponseEntity.ok(group);
    }
}
