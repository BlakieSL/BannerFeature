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
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "banner", schema = "pos")
@Getter
@Setter
public class Banner {
    private static final int TITLE_MAX_LENGTH = 100;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqcodebanner_generator")
    @SequenceGenerator(name = "seqcodebanner_generator", sequenceName = "pos.seqcodebanner", allocationSize = 1)
    @Column(name = "code_banner", nullable = false)
    private Integer codeBanner;

    @Size(max = TITLE_MAX_LENGTH)
    @Column(name = "title", length = TITLE_MAX_LENGTH)
    private String title;

    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_send")
    private LocalDateTime plannedDate;

    @Column(name = "status")
    private short status; // 0 - чернетка, 1 - заплановано, 2 - готово до відправки, 3 - відправлено

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
    @JoinColumn(name = "type_banner", nullable = false)
    private TypeBanner typeBanner;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "code_group_banner", nullable = false)
    private GroupBanner groupBanner;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_begin")
    private LocalDateTime dateBegin;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_end")
    private LocalDateTime dateEnd;

    @Column(name = "sign_activity", nullable = false)
    private short signActivity;

    @OneToMany(mappedBy = "banner",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
            orphanRemoval = true)
    private final Set<SetBanner> setBanners = new HashSet<>();
}
