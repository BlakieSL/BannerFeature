package com.web.invoice.primarydb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ClientDto {
    private Integer codeClient;
    private String surname;
    private String phone;
}
