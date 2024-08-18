package com.web.invoice.primarydb.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "client", schema = "pos")
@Getter
@Setter
public class Client {
    @Id
    @Column(name = "code_client")
    private Integer codeClient;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "code_group_client")
    private GroupClient groupClient;

    @Column(name = "surname")
    private String surname;

    @Column(name = "name")
    private String name;

    @Column(name = "patronymic")
    private String patronymic;

    @Column(name = "document"   )
    private String document;

    @Column(name = "impocition")
    private String impocition;

    @Column(name = "description")
    private String description;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "code_dealer")
    private Integer codeDealer;

    @Column(name = "code_discount_program")
    private Integer codeDiscountProgram;

    @Column(name = "date_begin")
    private LocalDate dateBegin;

    @Column(name = "date_end")
    private LocalDate dateEnd;

    @Column(name = "message")
    private String message;

    @Column(name = "date_birth")
    private LocalDate dateBirth;

    @Column(name = "sum_receipt")
    private BigDecimal sumReceipt;

    @Column(name = "sign_activity")
    private Short signActivity;

    @Column(name = "time_activity")
    private String timeActivity;

    @Column(name = "day_week")
    private Short dayWeek;

    @Column(name = "version_row")
    private Long versionRow;

    @Column(name = "type_card")
    private Short typeCard;

    @Column(name = "id_external")
    private String idExternal;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "add_info")
    private String addInfo;

    @OneToMany(mappedBy = "client",cascade = CascadeType.REMOVE)
    private final Set<BarcodeClient> barcodeClients = new HashSet<>();
}
