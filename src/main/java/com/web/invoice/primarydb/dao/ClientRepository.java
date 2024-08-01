package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Integer> {
}