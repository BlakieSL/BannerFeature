package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.UserPosView;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserPosViewRepository extends CrudRepository<UserPosView, Integer> {

    @Query(value ="select case when u.code_shop = 0 then '-Все-' else s.name_shop end name_shop,\n" +
            "       p.name_profile, u.card_number original_card_number, u.pswd as password, u.pswd as original_password,\n" +
            "       u.user_name as username,\n" +
            "       case when u.sign_activity = 1 then 'Да' else 'Нет' end sign_activity_text,\n" +
            "       u.*\n" +
            "from pos.user_pos u\n" +
            "         left outer join pos.shops s on (s.code_shop = u.code_shop)\n" +
            "         left outer join pos.profile p on (p.code_profile = u.code_profile)\n" +
            "where u.code_shop = (case when :codeShop = -2 then u.code_shop else :codeShop end)", nativeQuery = true)
    List<UserPosView> getUserPosList(@Param("codeShop") int codeShop);
}
