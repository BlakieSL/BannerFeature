package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Client;
import com.web.invoice.primarydb.model.PriceType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {

    /*
    @Query(value = "select * from pos.price_type where abr_type = :abrType", nativeQuery = true)
    Client findByPhone(@Param("phone") String phone);

     */
}