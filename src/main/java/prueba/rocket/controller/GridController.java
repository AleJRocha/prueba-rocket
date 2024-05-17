package gob.oax.sifov.controller;

import gob.oax.sifov.service.GridService;
import gob.oax.sifov.utils.SesionManager;
import gob.oax.sifov.web.Pagina;
import gob.oax.sifov.web.Response;
import gob.oax.sifov.web.SesionWeb;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Ale Rocha
 */
@Controller
@RequestMapping("/grid")
public class GridController {

    private static final Logger LOGGER = Logger.getLogger(GridController.class);

    @Autowired
    private GridService gridService;

    @RequestMapping(value = "/obtenerPaginaRegistros", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String obtenerPaginaRegistros(HttpServletRequest request,
            @RequestParam("claveGrid") String claveGrid, Pagina pagina,
            @RequestParam("jfilters") String jfilters,
            @RequestParam(value = "jsorts", required = false, defaultValue = "") String jsorts) {
        Response response = new Response();
        try {
            System.out.println("claveGrid: " + claveGrid);
            List<Map<String, Object>> filters = (JSONArray) JSONValue.parse(jfilters);
//            filters.forEach(System.out::println);
            List<Map<String, Object>> sorts = (JSONArray) JSONValue.parse(jsorts);

            HttpSession httpSession = request.getSession(true);
            SesionWeb sesionWeb = (SesionWeb) httpSession.getAttribute("sesionWeb");
            int idOficina = sesionWeb.getOficinaUsuario();

            Map<String, Object> parametro = new HashMap<>();
            parametro.put("field", "idUnidadEjecutoraUsuario");
            parametro.put("operator", "eq");
            parametro.put("value", "");
            filters.add(parametro);
            
            if (claveGrid.equals("registroSolicitudesUR")) {
                parametro.put("field", "idOficina");
                parametro.put("operator", "eq");
                parametro.put("value", idOficina);
                filters.add(parametro);
            }
            
            filters.add(parametro);

            filters.add(parametro);

            pagina.setFilters(filters);
            pagina.setSorts(sorts);

            pagina = gridService.obtenerPaginaRegistros(claveGrid, pagina);

            response.addValue("registros", pagina.getRegistros());
            response.addValue("total", pagina.getTotal());
            response.addValue("claveGrid", claveGrid);
            response.doSuccess();
        } catch (Exception ex) {
            response.doError(ex.getLocalizedMessage());
        } finally {
            return response.out();
        }
    }
}
