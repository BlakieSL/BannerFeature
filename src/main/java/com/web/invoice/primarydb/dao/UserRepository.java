package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.UserPos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserPos, Integer> {
    Optional<UserPos> findByUsername(String username);

    Optional<UserPos> findByUsernameAndCodeShop(String username, int codeShop);

    Optional<UserPos> findByUsernameIgnoreCase(String username);

    @Query(value = "select count(*) cnt from pos.access_event e, pos.user_pos u\n" +
            "where e.code_event = :codeEvent and u.user_name = :userName\n" +
            "and u.code_profile = e.code_profile\n", nativeQuery = true)
    Integer getAccess(@Param("userName") String userName,
                      @Param("codeEvent") int codeEvent);

//    @Query(value = "select set_config('cashdesk.code_user', :codeUser, false)", nativeQuery = true)
//    void setConfig(@Param("codeUser") String codeUser);

    @Query(value = "select set_config('cashdesk.code_user', :codeUser, false) || set_config('cashdesk.ip_source', :ipSource , false) as col1", nativeQuery = true)
    void setConfig(@Param("codeUser") String codeUser, @Param("ipSource") String ipSource);

    @Query(value="select nextval('pos.user_pos_code_user_seq')", nativeQuery = true)
    int getNextCodeUser();

    Optional<UserPos> findByCardNumberAndCodeShop(String cardNumber, int codeShop);

    Optional<UserPos> findByCardNumber(String cardNumber);

}
