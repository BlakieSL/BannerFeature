package com.web.invoice.primarydb.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "set_banner")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SetBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
