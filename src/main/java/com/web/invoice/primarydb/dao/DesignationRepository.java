package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DesignationRepository extends JpaRepository<Designation, Integer> {
    Optional<List<Designation>> findAllByFieldName(String fieldName);
}