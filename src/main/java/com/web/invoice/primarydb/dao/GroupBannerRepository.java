package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.GroupBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupBannerRepository extends JpaRepository<GroupBanner, Integer> {
}
