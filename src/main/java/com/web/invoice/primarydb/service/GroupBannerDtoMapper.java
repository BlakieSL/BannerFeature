package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dto.GroupBannerDtoRequest;
import com.web.invoice.primarydb.dto.GroupBannerDto;
import com.web.invoice.primarydb.model.GroupBanner;
import org.springframework.stereotype.Service;

@Service
public class GroupBannerDtoMapper {

    public GroupBannerDto map(GroupBanner groupBanner) {
        return new GroupBannerDto(
                groupBanner.getCodeGroupBanner(),
                groupBanner.getName()
        );
    }

    public GroupBanner map(GroupBannerDtoRequest dto) {
        GroupBanner groupBanner = new GroupBanner();
        groupBanner.setName(dto.getName());
        return groupBanner;
    }
}
