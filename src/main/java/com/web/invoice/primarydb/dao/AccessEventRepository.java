package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.AccessEvent;
import com.web.invoice.primarydb.model.AccessEventId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccessEventRepository extends CrudRepository<AccessEvent, AccessEventId> {
    @Query(value = "select * from pos.access_event where code_profile = :codeProfile", nativeQuery = true)
    List<AccessEvent> getAccessEventList(@Param("codeProfile") int codeProfile);
}
