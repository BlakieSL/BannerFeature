package com.web.invoice.primarydb.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClientFindByBarcodeDto {
    List<Integer> barcodes;
}