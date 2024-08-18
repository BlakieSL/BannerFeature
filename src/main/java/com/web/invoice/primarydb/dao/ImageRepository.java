package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    Optional<List<Image>> findByTypeValueAndCodeValue(int typeValue, int codeValue);
    Optional<List<Image>> findByTypeValue(int typeValue);
    Optional<Integer> findTopByTypeValueAndCodeValueOrderByNumDesc(int typeValue, int codeValue);
}