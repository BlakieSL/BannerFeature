package com.web.invoice.primarydb.model;

import lombok.*;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "set_banner", schema = "pos")
@Data
public class SetBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqcodesetbanner_generator")
    @SequenceGenerator(name = "seqcodesetbanner_generator", sequenceName = "pos.seqcodesetbanner", allocationSize = 1)
    @Column(name = "code_set_banner", nullable = false)
    private Integer codeSetBanner;

    @ManyToOne
    @JoinColumn(name = "code_banner", nullable = false)
    private Banner banner;

    @Column(name = "code_value") // client or group_client
    private Integer codeValue;

    @Column(name = "type_value") // 0 - client, 1 - group_client
    private short typeValue;
}
