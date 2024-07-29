package com.web.invoice.primarydb.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "price_type", schema = "pos")
//@Subselect(value = "select 1")
@Getter
@Setter
public class PriceType {

    @Id
    private String abrType;
    private String nameType;
    private int priority;
}
