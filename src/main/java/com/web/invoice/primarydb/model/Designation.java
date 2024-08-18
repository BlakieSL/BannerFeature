package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "designation", schema = "pos")
@Getter
@Setter
public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "designation_code_des_seq")
    @SequenceGenerator(name = "designation_code_des_seq", sequenceName = "pos.designation_code_des_seq", allocationSize = 1)
    @Column(name = "code_des", nullable = false)
    private Integer codeDes;

    @NotNull
    @Size(max = 50)
    @Column(name = "table_name", length = 50, nullable = false)
    private String tableName;

    @NotNull
    @Size(max = 30)
    @Column(name = "field_name", length = 30, nullable = false)
    private String fieldName;

    @NotNull
    @Column(name = "short_value", nullable = false)
    private Short shortValue;

    @NotNull
    @Size(max = 250)
    @Column(name = "description", length = 250, nullable = false)
    private String description;

    @Size(max = 20)
    @Column(name = "schema_name", length = 20)
    private String schemaName;

    @NotNull
    @Column(name = "version_row", nullable = false)
    private Long versionRow = 0L;
}
