package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
}