package com.web.invoice.primarydb;

import com.web.invoice.primarydb.model.*;
import com.web.invoice.primarydb.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api-option")
public class OptionController {
    private final PriceTypeService priceTypeService;
    private final WorkplaceStatusService workplaceStatus;

    private final HttpServletRequest request;
    @Value("${report-server-ip}")
    private String reportServerIp;


    public OptionController(PriceTypeService priceTypeService, WorkplaceStatusService workplaceStatus, HttpServletRequest request) {
        this.priceTypeService = priceTypeService;
        this.workplaceStatus = workplaceStatus;
        this.request = request;
    }

    private ConnectionData getConnectionData() {
        ConnectionData connectionData = new ConnectionData();
        connectionData.setCodeUser(getCodeUser());
        connectionData.setIpSource(request.getRemoteHost());
        return connectionData;
    }

    @RequestMapping("code-user")
    public String getCodeUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return String.valueOf(((UserPos)auth.getPrincipal()).getCodeUser());
    }

    @RequestMapping(value = "all-price_type")
    public List<PriceType> getAllPriceType() {
        return priceTypeService.getAllPriceType();
    }

    @RequestMapping(value = "all-workplace-status")
    public List<WorkplaceStatus> getAllWorkplaceStatus() {
        return workplaceStatus.getAllWorkplaceStatus();
    }

    @RequestMapping(value = "all-workplace-status-filtered")
    public List<WorkplaceStatus> getAllWorkplaceStatusFiltered(@RequestParam("toCheckIdWorkplace") Boolean toCheckIdWorkplace,
                                                               @RequestParam("idWorkplace") Integer idWorkplace,
                                                               @RequestParam("toCheckCodeShop") Boolean toCheckCodeShop,
                                                               @RequestParam("codeShop") Integer codeShop,
                                                               @RequestParam("ignoreInterval") Integer ignoreInterval,
                                                               @RequestParam("problemInterval") Integer problemInterval,
                                                               @RequestParam("toCheckProblem") Boolean toCheckProblem
    ) {
        return workplaceStatus.getAllWorkplaceStatusFiltered( toCheckIdWorkplace,  idWorkplace,  toCheckCodeShop,  codeShop, ignoreInterval, problemInterval, toCheckProblem);
    }

    @PostMapping(value = "save-price_type", consumes = "application/json", produces = "application/json")
    public void savePriceType(@RequestBody PriceType priceType) {
        priceTypeService.save(priceType);
    }

    @DeleteMapping(value = "delete-price-type", consumes = "application/json", produces = "application/json")
    public void deletePriceType(@RequestBody PriceType priceType) {
        priceTypeService.delete(priceType);
    }
}
