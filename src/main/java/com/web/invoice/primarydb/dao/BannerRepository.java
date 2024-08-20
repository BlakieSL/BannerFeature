package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.dto.UserWorkedOnBanner;
import com.web.invoice.primarydb.model.Banner;
import com.web.invoice.primarydb.model.TypeBanner;
import com.web.invoice.primarydb.model.UserPos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    @Query( "SELECT b " +
            "FROM Banner b " +
            "WHERE (:codeGroupBanner IS NULL OR b.groupBanner.codeGroupBanner = :codeGroupBanner)" +
            "AND (:codeTypeBanner IS NULL OR b.typeBanner.codeTypeBanner = :codeTypeBanner)" +
            "AND (:status IS NULL OR b.status = :status)"
    )
    Optional<List<Banner>> findByTypeStatusAndGroup(
            @Param("codeGroupBanner") Integer codeGroupBanner,
            @Param("codeTypeBanner") Integer codeTypeBanner,
            @Param("status") Short status);

    Optional<List<Banner>> findByGroupBannerCodeGroupBanner(int codeGroupBanner);

    @Query(value =
            "SELECT user_pos.code_user, user_pos.fio " +
                    "FROM pos.banner banner " +
                    "JOIN pos.a_banner audit_banner ON audit_banner.code_banner = :codeBanner " +
                    "JOIN pos.user_pos user_pos ON audit_banner.a_code_user = user_pos.code_user " +
                    "ORDER BY audit_banner.a_time_operation DESC " +
                    "LIMIT 1", nativeQuery = true)
    Optional<List<Object[]>> findLastUserThatWorkedOnBannerNative(@Param("codeBanner") Integer codeBanner);

}