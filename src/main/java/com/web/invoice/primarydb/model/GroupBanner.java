package com.web.invoice.primarydb.model;

import lombok.Generated;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "group_banner", schema = "pos")
@Getter
@Setter
public class GroupBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqcodegroupbanner_generator")
    @SequenceGenerator(name = "seqcodegroupbanner_generator", sequenceName = "pos.seqcodegroupbanner", allocationSize = 1)
    @Column(name = "code_group_banner", nullable = false)
    private Integer codeGroupBanner;

    @NotBlank
    @Column(name = "name_group_banner", nullable = false)
    private String name;

    @OneToMany(mappedBy = "groupBanner", cascade = CascadeType.REMOVE)
    private final Set<Banner> banners = new HashSet<>();
}
