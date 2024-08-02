package com.web.invoice.primarydb.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "client", schema = "pos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_client")
    private Integer codeClient;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "code_group_client", nullable = false)
    private GroupClient groupClient;


    @Column(name = "surname", nullable = false, length = 70)
    private String surname;

    @Column(name = "name", nullable = false, length = 70)
    private String name;

    @Column(name = "patronymic", length = 70)
    private String patronymic;

    @Column(name = "document", length = 120)
    private String document;

    @Column(name = "impocition", length = 15)
    private String impocition;

    @Column(name = "description", length = 250)
    private String description;

    @Column(name = "discount", nullable = false, precision = 7, scale = 4)
    private BigDecimal discount;

    @Column(name = "code_dealer")
    private Integer codeDealer;

    @Column(name = "code_discount_program")
    private Integer codeDiscountProgram;

    @Column(name = "date_begin")
    private LocalDate dateBegin;

    @Column(name = "date_end")
    private LocalDate dateEnd;

    @Column(name = "message", length = 300)
    private String message;

    @Column(name = "date_birth")
    private LocalDate dateBirth;

    @Column(name = "sum_receipt", nullable = false, precision = 19, scale = 2)
    private BigDecimal sumReceipt;

    @Column(name = "sign_activity", nullable = false)
    private Short signActivity;

    @Column(name = "time_activity", length = 250)
    private String timeActivity;

    @Column(name = "day_week")
    private Short dayWeek;

    @Column(name = "version_row", nullable = false)
    private Long versionRow;

    @Column(name = "type_card", nullable = false)
    private Short typeCard;

    @Column(name = "id_external", length = 100)
    private String idExternal;

    @Column(name = "phone", length = 100)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "add_info", columnDefinition = "text")
    private String addInfo;
}
