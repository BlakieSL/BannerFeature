package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.GroupClientRepository;
import com.web.invoice.primarydb.dto.GroupClientDto;
import com.web.invoice.primarydb.mapper.GroupClientMapper;
import com.web.invoice.primarydb.model.GroupClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupClientService {
    private final GroupClientMapper groupClientMapper;
    private final GroupClientRepository groupClientRepository;
    public GroupClientService(
            final GroupClientMapper groupClientMapper,
            final GroupClientRepository groupClientRepository
    ) {
        this.groupClientMapper = groupClientMapper;
        this.groupClientRepository = groupClientRepository;
    }

    public List<GroupClientDto> getAllGroupClients() {
        List<GroupClient> groups = groupClientRepository.findAll();
        return groups.stream()
                .map(groupClientMapper::toDto)
                .collect(Collectors.toList());
    }
}
