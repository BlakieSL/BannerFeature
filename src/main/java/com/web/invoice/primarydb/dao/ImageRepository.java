package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    Optional<List<Image>> findByTypeValueAndCodeValue(int typeValue, int codeValue);
    Optional<List<Image>> findByTypeValue(int typeValue);
    @Query( "SELECT COALESCE(MAX(image.num), 0) " +
            "FROM Image image" +
            " WHERE image.typeValue = :typeValue AND image.codeValue = :codeValue")
    Integer findTopNumByTypeValueAndCodeValueOrderByNumDesc(@Param("typeValue") int typeValue, @Param("codeValue") int codeValue);

}