package com.web.invoice.primarydb.model;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "image", schema = "pos")
@Getter
@Setter
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqcodeimage_generator")
    @SequenceGenerator(name = "seqcodeimage_generator", sequenceName = "pos.seqcodeimage", allocationSize = 1)
    @Column(name = "code_image", nullable = false)
    private Integer codeImage;

    @NotNull
    @Column(name = "type_value", nullable = false)
    private Integer typeValue;

    @NotNull
    @Column(name = "code_value", nullable = false)
    private Integer codeValue;

    @NotNull
    @Column(name = "num", nullable = false)
    private Integer num;

    @NotNull
    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    @Column(name = "image", nullable = false)
    private byte[] image;

    @Size(max = 250)
    @Column(name = "description", length = 250)
    private String description;

    @NotNull
    @Column(name = "type_ref", nullable = false)
    private Integer typeRef;

    @Size(max = 250)
    @Column(name = "type_usage", length = 250)
    private String typeUsage;

    @NotNull
    @Column(name = "version_row", nullable = false)
    private Long versionRow = 0L;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.versionRow++;
    }
}
