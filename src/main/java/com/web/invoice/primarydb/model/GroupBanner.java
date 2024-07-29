package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "group_banner")
@Getter
@Setter
public class GroupBanner {
    @Id
    @Column(name = "code_group_banner", nullable = false)
    private Integer codeGroupBanner;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "groupBanner", cascade = CascadeType.ALL)
    private final Set<Banner> banners = new HashSet<>();
}
