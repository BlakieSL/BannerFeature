package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.BarcodeClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BarcodeClientRepository extends JpaRepository<BarcodeClient, String> {
    @Query( "SELECT bc " +
            "FROM BarcodeClient bc " +
            "WHERE bc.barcode IN :barcodes")
    Optional<List<BarcodeClient>> findByBarcodes(@Param("barcodes") List<String> barcodes);
}