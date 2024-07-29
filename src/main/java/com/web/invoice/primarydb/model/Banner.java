package com.web.invoice.primarydb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "banner")
@Getter
@Setter
public class Banner {
    private static final int TITLE_MAX_LENGTH = 70;
    @Id
    @Column(name = "code_banner", nullable = false)
    private Integer codeBanner;

    @Size(max = TITLE_MAX_LENGTH)
    @Column(name = "title", length = TITLE_MAX_LENGTH)
    private String title;

    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "plannedDate")
    private LocalDateTime plannedDate;

    @Column(name = "status")
    private short status; // 1 - чернетка, 2 - заплановано 3 - відправлено

    @Column(name = "send_result")
    private String sendResult;

    @Column(name = "id_external")
    private Integer externalId;

    @Column(name = "note")
    private String note;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date_create", nullable = false)
    private LocalDate dateCreate;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "code_type_banner", nullable = false)
    private TypeBanner typeBanner;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "code_group_banner", nullable = false)
    private GroupBanner groupBanner;
}
