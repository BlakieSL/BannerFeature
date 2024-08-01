package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.GroupClient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupClientRepository extends JpaRepository<GroupClient, Integer> {
}