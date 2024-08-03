package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    @Query( "SELECT b " +
            "FROM Banner b " +
            "WHERE (:codeTypeBanner IS NULL OR b.typeBanner.codeTypeBanner = :codeTypeBanner)" +
            " AND (:status IS NULL OR b.status = :status)"
    )
    Optional<List<Banner>> findByTypeAndStatus(@Param("codeTypeBanner") Integer codeTypeBanner,
                                         @Param("status") Short status);
}