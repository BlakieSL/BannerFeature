package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "barcode_client", schema = "pos")
@Getter
@Setter
public class BarcodeClient {
    @Id
    @Column(name = "barcode")
    private String barcode;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "code_client")
    private Client client;

    @NotNull
    @Column(name = "sign_activity")
    private Short signActivity;

    @Column(name = "add_field")
    private String addField;

    @Column(name = "version_row")
    private Long versionRow;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "add_info")
    @Transient
    private String addInfo;
}