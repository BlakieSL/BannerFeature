package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    Optional<Client> findByPhone(String phone);
}