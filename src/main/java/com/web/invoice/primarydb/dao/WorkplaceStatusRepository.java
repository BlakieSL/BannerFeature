package com.web.invoice.primarydb.dao;

import com.web.invoice.primarydb.model.PriceType;
import com.web.invoice.primarydb.model.WorkplaceStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkplaceStatusRepository extends CrudRepository<WorkplaceStatus, Integer> {

    @Query(value = "select (code_shop || '_' || id_workplace) AS key, code_shop, id_workplace, problem, replication_begin, replication_end, successful_update, successful_send\n" +
            "\n" +
            "from (select r.id_workplace      id_workplace,\n" +
            "             r.code_shop         code_shop,\n" +
            "             case\n" +
            "                 when CURRENT_TIMESTAMP - r.last_time_connect > interval '5 MINUTES' then 'Касса не обновляется'\n" +
            "                 else\n" +
            "                             case\n" +
            "                                 when CURRENT_TIMESTAMP - r.last_receive_time > interval '5 MINUTES'\n" +
            "                                     then 'Нет данных от кассы '\n" +
            "                                 else '' end\n" +
            "                             ||\n" +
            "                             case\n" +
            "                                 when CURRENT_TIMESTAMP - r.last_send_time > interval '5 MINUTES'\n" +
            "                                     then 'Касса не обновляется'\n" +
            "                                 else '' end\n" +
            "                         ||\n" +
            "                             case when r.last_time_connect < r.last_time_error then 'Ошибка при обновлении' else '' end\n" +
            "                 end             problem,\n" +
            "             r.last_time_connect replication_begin,\n" +
            "             r.last_time_finish  replication_end,\n" +
            "             r.last_receive_time successful_update,\n" +
            "             r.last_send_time    successful_send\n" +
            "      from pos.replicator_status r\n" +
            "               full outer join pos.replicator_status p\n" +
            "                               on p.code_shop = r.code_shop and p.id_workplace = r.id_workplace and\n" +
            "                                  p.status_type = 3 and p.id_workplace > 0\n" +
            "      where r.status_type = 1\n" +
            "        and r.id_workplace > 0) a\n" +
            "order by code_shop, id_workplace;", nativeQuery = true)
    List<WorkplaceStatus> getWorkplaceStatusList();

    @Query(value = "select (code_shop || '_' || id_workplace) AS key,\n" +
            "       code_shop,\n" +
            "       id_workplace,\n" +
            "       status,\n" +
            "       problem,\n" +
            "       replication_begin,\n" +
            "       replication_end,\n" +
            "       successful_update,\n" +
            "       successful_send,\n" +
            "       last_time_error,\n" +
            "       error_message\n" +
            "\n" +
            "from (select r.id_workplace      id_workplace,\n" +
            "             r.code_shop         code_shop,\n" +
            "             (case when (CURRENT_TIMESTAMP - r.last_time_connect > (interval '1 minutes' * :problemInterval)) then 'Offline' else 'Online' end) status,\n" +
            "             case\n" +
            "                 when (CURRENT_TIMESTAMP - r.last_time_connect > (interval '1 minutes' * :problemInterval))\n" +
            "                     and (CURRENT_TIMESTAMP - r.last_time_connect < (interval '1 days' * :ignoreInterval))\n" +
            "                     then ' Каса не оновлюється '\n" +
            "                 else\n" +
            "                             case\n" +
            "                                 when (CURRENT_TIMESTAMP - r.last_receive_time > (interval '1 minutes' * :problemInterval))--'5 MINUTES'\n" +
            "                                     and (CURRENT_TIMESTAMP - r.last_receive_time < (interval '1 days' * :ignoreInterval))\n" +
            "                                     then ' Немає даних від каси '\n" +
            "                                 else '' end\n" +
            "                             ||\n" +
            "                             case\n" +
            "                                 when (CURRENT_TIMESTAMP - r.last_send_time > (interval '1 minutes' * :problemInterval))\n" +
            "                                     and (CURRENT_TIMESTAMP - r.last_send_time < (interval '1 days' * :ignoreInterval))\n" +
            "                                     then ' Каса не оновлюється '\n" +
            "                                 else '' end\n" +
            "                         ||\n" +
            "                             case when r.last_time_connect < r.last_time_error and (CURRENT_TIMESTAMP - r.last_time_connect < (interval '1 days' * :ignoreInterval)) then ' Помилка при оновленні ' else '' end\n" +
            "                 end             problem,\n" +
            "             r.last_time_connect replication_begin,\n" +
            "             r.last_time_finish  replication_end,\n" +
            "             r.last_receive_time successful_update,\n" +
            "             r.last_send_time    successful_send,\n" +
            "            r.last_time_error last_time_error,\n" +
            "            r.error_message error_message\n" +
            "      from pos.replicator_status r\n" +
            "               full outer join pos.replicator_status p\n" +
            "                               on p.code_shop = r.code_shop and p.id_workplace = r.id_workplace and\n" +
            "                                  p.status_type = 3 and p.id_workplace > 0\n" +
            "      where r.status_type = 1\n" +
            "        and r.id_workplace > 0\n" +
            "        and CASE\n" +
            "                WHEN :toCheckIdWorkplace THEN r.id_workplace = :idWorkplace\n" +
            "                ELSE true\n" +
            "          END\n" +
            "        and CASE\n" +
            "                WHEN :toCheckCodeShop THEN r.code_shop = :codeShop\n" +
            "                ELSE true\n" +
            "          END) a\n" +
            "where CASE\n" +
            "          WHEN :toCheckProblem THEN not (problem = '')\n" +
            "          ELSE true\n" +
            "          END\n" +
            "order by code_shop, id_workplace;", nativeQuery = true)
    List<WorkplaceStatus> getWorkplaceStatusListFiltered(@Param("toCheckIdWorkplace") Boolean toCheckIdWorkplace,
                                                        @Param("idWorkplace") Integer idWorkplace,
                                                        @Param("toCheckCodeShop") Boolean toCheckCodeShop,
                                                        @Param("codeShop") Integer codeShop,
                                                        @Param("ignoreInterval") Integer ignoreInterval,
                                                        @Param("problemInterval") Integer problemInterval,
                                                        @Param("toCheckProblem") Boolean toCheckProblem
    );
}
