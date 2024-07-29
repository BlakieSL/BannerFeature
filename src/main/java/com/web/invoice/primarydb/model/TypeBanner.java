package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "type_banner")
@Getter
@Setter
public class TypeBanner {
    @Id
    @Column(name = "code_type_banner", nullable = false)
    private Integer codeTypeBanner;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "typeBanner", cascade = CascadeType.ALL)
    private final Set<Banner> banners = new HashSet<>();
}
