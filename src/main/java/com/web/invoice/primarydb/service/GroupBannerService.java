package com.web.invoice.primarydb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import com.web.invoice.primarydb.component.JsonPatchHelper;
import com.web.invoice.primarydb.dao.GroupBannerRepository;
import com.web.invoice.primarydb.dto.GroupBannerDtoRequest;
import com.web.invoice.primarydb.dto.GroupBannerDto;
import com.web.invoice.primarydb.model.GroupBanner;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class GroupBannerService {
    private final ValidationHelper validationHelper;
    private final GroupBannerMapper groupBannerMapper;
    private final JsonPatchHelper jsonPatchHelper;
    private final GroupBannerRepository groupBannerRepository;

    public GroupBannerService(
            final ValidationHelper validationHelper,
            final GroupBannerMapper groupBannerMapper,
            final JsonPatchHelper jsonPatchHelper,
            final GroupBannerRepository groupBannerRepository
    ) {
        this.validationHelper = validationHelper;
        this.groupBannerMapper = groupBannerMapper;
        this.jsonPatchHelper = jsonPatchHelper;
        this.groupBannerRepository = groupBannerRepository;
    }

    @Transactional
    public void saveGroupBanner(final GroupBannerDtoRequest dto) {
        validationHelper.validate(dto);
        groupBannerRepository.save(groupBannerMapper.toEntity(dto));
    }

    @Transactional
    public void modifyGroupBanner(final int codeGroupBanner, final JsonMergePatch patch) throws JsonPatchException, JsonProcessingException {
        GroupBanner groupBanner = groupBannerRepository.findById(codeGroupBanner)
                        .orElseThrow(() -> new NoSuchElementException("GroupBanner with id: " + codeGroupBanner + " not found"));

        GroupBannerDtoRequest dto = groupBannerMapper.toRequestDto(groupBanner);
        GroupBannerDtoRequest patchedDto = jsonPatchHelper.applyPatch(patch, dto, GroupBannerDtoRequest.class);

        validationHelper.validate(dto);
        groupBannerMapper.updateEntityFromDto(patchedDto,groupBanner);

        groupBannerRepository.save(groupBanner);
    }

    @Transactional
    public void deleteGroupBanner(final int codeGroupBanner) {
        GroupBanner groupBanner = groupBannerRepository.findById(codeGroupBanner)
                .orElseThrow(() -> new NoSuchElementException(
                        "GroupBanner with id: " + codeGroupBanner + " not found"));
        groupBannerRepository.delete(groupBanner);
    }

    public List<GroupBannerDto> getAllGroupBanner() {
        List<GroupBanner> groupBanners = groupBannerRepository.findAll();
        return groupBanners.stream()
                .map(groupBannerMapper::toDto)
                .collect(Collectors.toList());
    }
}
