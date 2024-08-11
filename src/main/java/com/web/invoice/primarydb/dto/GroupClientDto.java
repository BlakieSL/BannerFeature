package com.web.invoice.primarydb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupClientDto {
    private Integer codeGroup;
    private String nameGroup;
    private Integer codeParentGroup;
    private List<GroupClientDto> children;
}
