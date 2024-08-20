package com.web.invoice.primarydb.mapper;

import com.web.invoice.primarydb.dao.*;
import com.web.invoice.primarydb.dto.*;
import com.web.invoice.primarydb.model.*;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = { LocalDate.class, LocalDateTime.class, DateTimeFormatter.class })
public abstract class BannerMapper {
    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private TypeBannerRepository typeBannerRepository;

    @Autowired
    private GroupBannerRepository groupBannerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private GroupClientRepository groupClientRepository;

    //mappings
    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    @Mapping(source = "groupBanner", target = "codeGroupBanner", qualifiedByName = "mapGroupBannerToCode")
    @Mapping(target = "groupClients", ignore = true)
    @Mapping(target = "singleClients", ignore = true)
    @Mapping(target = "barcode", ignore = true)
    @Mapping(target = "link", ignore = true)
    public abstract BannerDetailedDto toDetailedDto(Banner banner);

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    @Mapping(target = "lastUserCode", ignore = true)
    @Mapping(target = "lastUserFio", ignore = true)
    public abstract BannerSummaryDto toSummaryDto(Banner banner);

    @Mapping(source = "codeTypeBanner", target = "typeBanner", qualifiedByName = "mapTypeBanner")
    @Mapping(source = "codeGroupBanner", target = "groupBanner", qualifiedByName = "mapGroupBanner")
    @Mapping(target = "dateCreate", ignore = true)
    @Mapping(target = "dateBegin", ignore = true)
    @Mapping(target = "dateEnd", ignore = true)
    @Mapping(target = "signActivity", ignore = true)
    @Mapping(target = "codeBanner", ignore = true)
    @Mapping(target = "setBanners", ignore = true)
    @Mapping(target = "detailData", ignore = true)
    public abstract Banner toEntity(BannerDtoRequest dto);

    @Mapping(source = "typeBanner", target = "codeTypeBanner", qualifiedByName = "mapTypeBannerToCode")
    @Mapping(source = "groupBanner", target = "codeGroupBanner", qualifiedByName = "mapGroupBannerToCode")
    @Mapping(target = "groupClients", ignore = true)
    @Mapping(target = "singleClients", ignore = true)
    public abstract BannerDtoRequest toRequestDto(Banner banner);

    @Mapping(target = "typeBanner", ignore = true)
    @Mapping(target = "groupBanner", ignore = true)
    @Mapping(target = "dateCreate", ignore = true)
    @Mapping(target = "dateBegin", ignore = true)
    @Mapping(target = "dateEnd", ignore = true)
    @Mapping(target = "signActivity", ignore = true)
    @Mapping(target = "codeBanner", ignore = true)
    @Mapping(target = "setBanners", ignore = true)
    @Mapping(target = "detailData", ignore = true)
    public abstract void updateEntityFromDto(BannerDtoRequest dto, @MappingTarget Banner banner);

    @Mapping(target = "codeBanner", ignore = true)
    @Mapping(target = "dateCreate", expression = "java(LocalDate.now())")
    @Mapping(target = "plannedDate", ignore = true)
    @Mapping(target = "status", constant = "0") // готово до відправки змінюється(2) на чернетку(0)
    @Mapping(target = "title", expression = "java(banner.getTitle() + \" - копія \" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(\"dd-MM-yy HH:mm\")))")
    @Mapping(target = "groupBanner", source = "targetGroupBanner")
    public abstract Banner copyBanner(Banner banner, GroupBanner targetGroupBanner);


    //aftermappings
    @AfterMapping
    protected void mapToDetailedDto(@MappingTarget BannerDetailedDto dto, Banner banner) {
        Set<SimplifiedGroupClientDto> groupClients = mapGroupClients(banner);
        dto.setGroupClients(groupClients);

        Set<SimplifiedClientDto> singleClients = mapSingleClients(banner);
        dto.setSingleClients(singleClients);

        mapDetailDataToDto(banner, dto);
    }

    @AfterMapping
    protected void setDefaultValues(@MappingTarget Banner banner, BannerDtoRequest dto) {
        banner.setSignActivity((short) 1);
        banner.setDateCreate(LocalDate.now());

        if((dto.getSingleClients() != null && !dto.getSingleClients().isEmpty()) ||
                (dto.getGroupClients() != null && !dto.getGroupClients().isEmpty())) {
            Set<SetBanner> setBanners = new HashSet<>();
            dto.getGroupClients().forEach(groupId -> {
                SetBanner setBanner = new SetBanner();
                setBanner.setBanner(banner);
                setBanner.setCodeValue(groupId);
                setBanner.setTypeValue((short) 1);
                setBanners.add(setBanner);
            });

            dto.getSingleClients().forEach(clientId -> {
                SetBanner setBanner = new SetBanner();
                setBanner.setBanner(banner);
                setBanner.setCodeValue(clientId);
                setBanner.setTypeValue((short) 0);
                setBanners.add(setBanner);
            });
            banner.getSetBanners().addAll(setBanners);
        }

        banner.setDetailData(createDetailData(dto));
    }

    @AfterMapping
    protected void mapToRequestDto(@MappingTarget BannerDtoRequest dto, Banner banner) {
        Set<Integer> groupClients = getClients(banner, (short) 1);
        Set<Integer> singleClients = getClients(banner, (short) 0);

        dto.setGroupClients(groupClients);
        dto.setSingleClients(singleClients);

        mapDetailDataToDto(banner, dto);
    }

    @AfterMapping
    protected void mapLastUser(@MappingTarget BannerSummaryDto dto, Banner banner) {
        Optional<List<Object[]>> result = bannerRepository.findLastUserThatWorkedOnBannerNative(banner.getCodeBanner());

        if (result.isPresent() && !result.get().isEmpty()) {
            Object[] userData = result.get().get(0);

            dto.setLastUserCode((Integer) userData[0]);
            dto.setLastUserFio((String) userData[1]);
        }
    }


    //custom mappers
    public void customUpdate(BannerDtoRequest dto, Banner banner) {
        Set<Integer> newGroupClients = dto.getGroupClients();
        Set<Integer> newSingleClients = dto.getSingleClients();

        Set<SetBanner> currentSetBanners = banner.getSetBanners();
        Set<SetBanner> newSetBanners = new HashSet<>();

        newGroupClients.forEach(groupId -> {
            SetBanner setBanner = new SetBanner();
            setBanner.setBanner(banner);
            setBanner.setCodeValue(groupId);
            setBanner.setTypeValue((short) 1);
            newSetBanners.add(setBanner);
        });

        newSingleClients.forEach(clientId -> {
            SetBanner setBanner = new SetBanner();
            setBanner.setBanner(banner);
            setBanner.setCodeValue(clientId);
            setBanner.setTypeValue((short) 0);
            newSetBanners.add(setBanner);
        });
        currentSetBanners.removeIf(setBanner -> !newSetBanners.contains(setBanner));
        currentSetBanners.addAll(newSetBanners);

        banner.setDetailData(createDetailData(dto));
    }


    //helpers
    @Named("mapTypeBanner")
    TypeBanner mapTypeBanner(Integer codeTypeBanner) {
        return typeBannerRepository.findById(codeTypeBanner)
                .orElseThrow(() -> new NoSuchElementException("Banner type with id: " + codeTypeBanner + " not found"));
    }

    @Named("mapGroupBanner")
    GroupBanner mapGroupBanner(Integer codeGroupBanner) {
        return groupBannerRepository.findById(codeGroupBanner)
                .orElseThrow(() -> new NoSuchElementException("Banner group with id: " + codeGroupBanner + " not found"));
    }

    @Named("mapTypeBannerToCode")
    Integer mapTypeBannerToCode(TypeBanner typeBanner) {
        return typeBanner != null ? typeBanner.getCodeTypeBanner() : null;
    }

    @Named("mapGroupBannerToCode")
    Integer mapGroupBannerToCode(GroupBanner groupBanner) {
        return groupBanner != null ? groupBanner.getCodeGroupBanner() : null;
    }

    private Set<Integer> getClients(Banner banner, short typeValue)  {
        return banner.getSetBanners().stream()
                .filter(setBanner -> setBanner.getTypeValue() == typeValue)
                .map(SetBanner::getCodeValue)
                .collect(Collectors.toSet());
    }

    private Set<SimplifiedGroupClientDto> mapGroupClients(Banner banner) {
        return banner.getSetBanners().stream()
                .filter(setBanner -> setBanner.getTypeValue() == 1)
                .map(setBanner -> {
                    GroupClient groupClient = groupClientRepository.findById(setBanner.getCodeValue())
                            .orElseThrow(() -> new RuntimeException(
                                    "GroupClient not found with ID " + setBanner.getCodeValue()));
                    return new SimplifiedGroupClientDto(
                            groupClient.getCodeGroup(),
                            groupClient.getNameGroup()
                    );
                })
                .collect(Collectors.toSet());
    }

    private Set<SimplifiedClientDto> mapSingleClients(Banner banner) {
        return banner.getSetBanners().stream()
                .filter(setBanner -> setBanner.getTypeValue() == 0)
                .map(setBanner -> {
                    Client client = clientRepository.findById(setBanner.getCodeValue())
                            .orElseThrow(() -> new RuntimeException(
                                    "Client not found with ID " + setBanner.getCodeValue()));
                    return new SimplifiedClientDto(
                            client.getCodeClient(),
                            client.getSurname()
                    );
                })
                .collect(Collectors.toSet());
    }

    private DetailData createDetailData(BannerDtoRequest dto) {
        DetailData detailData = new DetailData();
        boolean hasData = false;

        if (dto.getBarcode() != null) {
            detailData.setBarcode(dto.getBarcode());
            hasData = true;
        }

        if (dto.getLink() != null) {
            detailData.setLink(dto.getLink());
            hasData = true;
        }

        return hasData ? detailData : null;
    }

    private <T> void mapDetailDataToDto(Banner banner, T dto) {
        DetailData detailData = banner.getDetailData();
        if (detailData != null) {
            if (detailData.getLink() != null) {
                if (dto instanceof BannerDtoRequest) {
                    ((BannerDtoRequest) dto).setLink(detailData.getLink());
                } else if (dto instanceof BannerDetailedDto) {
                    ((BannerDetailedDto) dto).setLink(detailData.getLink());
                }
            }
            if (detailData.getBarcode() != null) {
                if (dto instanceof BannerDtoRequest) {
                    ((BannerDtoRequest) dto).setBarcode(detailData.getBarcode());
                } else if (dto instanceof BannerDetailedDto) {
                    ((BannerDetailedDto) dto).setBarcode(detailData.getBarcode());
                }
            }
        }
    }
}
