package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.PriceType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PriceTypeRepository extends CrudRepository<PriceType, Integer> {

    @Query(value = "select * from pos.price_type where abr_type = :abrType", nativeQuery = true)
    List<PriceType> getPriceTypeList(@Param("abrType") String abrType);
}
