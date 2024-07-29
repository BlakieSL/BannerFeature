package com.web.invoice.primarydb.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class AccessEventId  implements Serializable {
    private int codeProfile;
    private int codeEvent;
}
