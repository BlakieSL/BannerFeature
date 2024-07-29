package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Config {
    private Integer codeShop;
    private Integer idWorkplace;
    private UserPos userPos;
    private String version;
    private List<Integer> accessEventList;
    private String reportServerIp;
    private String reportServerPort;
}
