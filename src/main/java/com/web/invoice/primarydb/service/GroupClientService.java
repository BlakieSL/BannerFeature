package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.GroupClientRepository;
import com.web.invoice.primarydb.dto.GroupClientDto;
import com.web.invoice.primarydb.mapper.GroupClientMapper;
import com.web.invoice.primarydb.model.GroupClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupClientService {

    private final GroupClientMapper groupClientMapper;
    private final GroupClientRepository groupClientRepository;

    public GroupClientService(
            GroupClientMapper groupClientMapper,
            GroupClientRepository groupClientRepository
    ) {
        this.groupClientMapper = groupClientMapper;
        this.groupClientRepository = groupClientRepository;
    }

    public List<GroupClientDto> getAllGroupClients() {
        List<GroupClient> groups = groupClientRepository.findAll();

        List<GroupClientDto> groupDtos = groups.stream()
                .map(groupClientMapper::toDto)
                .collect(Collectors.toList());

        GroupClientDto rootGroup = groupDtos.stream()
                .filter(group -> group.getCodeGroup() == 0)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Root group with codeGroup = 0 not found"));

        rootGroup.setChildren(buildTreeRecursive(groupDtos, rootGroup.getCodeGroup()));

        List<GroupClientDto> treeWithRoot = new ArrayList<>();
        treeWithRoot.add(rootGroup);

        return treeWithRoot;
    }

    public GroupClientDto getGroupClientById(int id) {
        GroupClient group = groupClientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        "GroupBanner with id: " + id + " not found"));
        System.out.println(group.getCodeGroup() + group.getNameGroup());
        return groupClientMapper.toDto(group);
    }

    private List<GroupClientDto> buildTreeRecursive(List<GroupClientDto> flatGroups, Integer parentId) {
        List<GroupClientDto> children = new ArrayList<>();
        for (GroupClientDto group : flatGroups) {
            if (Objects.equals(group.getCodeParentGroup(), parentId)) {
                group.setChildren(buildTreeRecursive(flatGroups, group.getCodeGroup()));
                children.add(group);
            }
        }
        children.sort(Comparator.comparingInt(GroupClientDto::getCodeGroup));
        return children;
    }
}
