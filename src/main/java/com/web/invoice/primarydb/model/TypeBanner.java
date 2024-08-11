package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "type_banner", schema = "pos")
@Getter
@Setter
public class TypeBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqcodetypebanner_generator")
    @SequenceGenerator(name = "seqcodetypebanner_generator", sequenceName = "pos.seqcodetypebanner", allocationSize = 1)
    @Column(name = "code_type_banner", nullable = false)
    private Integer codeTypeBanner;

    @NotBlank
    @Column(name = "name_type_banner", nullable = false)
    private String name;

    @OneToMany(mappedBy = "typeBanner", cascade = CascadeType.REMOVE)
    private final Set<Banner> banners = new HashSet<>();
}
