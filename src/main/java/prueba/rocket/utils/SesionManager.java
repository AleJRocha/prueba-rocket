package prueba.rocket.utils;

import prueba.rocket.web.SesionWeb;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpSession;

/**
 *
 */
public class SesionManager {

    private final HttpSession httpSession;
    private final SesionWeb sesion;

    public SesionManager(HttpSession httpSession) {
        this.httpSession = httpSession;
        this.sesion = (SesionWeb) httpSession.getAttribute("sesion");
    }

    public boolean isAutorizado() {
        Boolean autorizado = (Boolean) httpSession.getAttribute("autorizado");
        return (autorizado != null && autorizado);
    }

    public SesionWeb extraerSesionWeb() {
        SesionWeb sesionWeb = (SesionWeb) httpSession.getAttribute("sesion");
        return sesionWeb;
    }

    public boolean fijarSistemaActivo(String sis_id) {
        httpSession.setAttribute("idSistemaActivo", sis_id);

        return true;
    }

    public boolean fijarSistemaActivoPorAlias(String alias) {
        List<java.util.Map<String, Object>> menuUsuario = sesion.getMenuUsuario();
        for (Map<String, Object> sistema : menuUsuario) {
            if (sistema.get("alias").equals(alias)) {
                this.fijarSistemaActivo(sistema.get("sis_id").toString());
            }
        }
        return true;
    }

    public List<java.util.Map<String, Object>> extraerSistemasUsuario() {
        List<java.util.Map<String, Object>> menuUsuario = sesion.getMenuUsuario();

        return menuUsuario;
    }

    public Map<String, Object> extraerSistemaActivo() {
        String idSistemaActivo = (String) httpSession.getAttribute("idSistemaActivo");
        List<java.util.Map<String, Object>> menuUsuario = sesion.getMenuUsuario();

        if (idSistemaActivo == null) {
            fijarSistemaActivo(menuUsuario.get(0).get("sis_id").toString());
        }

        Map<String, Object> sistemaActivo = new HashMap<>();
        for (Map<String, Object> sistemaUsuario : menuUsuario) {
            if (sistemaUsuario.get("sis_id").equals(idSistemaActivo)) {
                return sistemaUsuario;
            }
        }

        return sistemaActivo;
    }

    public Map<String, Object> extraerSistemaPorAlias(String alias) {
        List<java.util.Map<String, Object>> menuUsuario = sesion.getMenuUsuario();

        if (alias.isEmpty()) {
            return menuUsuario.get(0);
        }

        Map<String, Object> sistema = new HashMap<>();
        for (Map<String, Object> sistemaUsuario : menuUsuario) {
            if (sistemaUsuario.get("alias").equals(alias)) {
                return sistemaUsuario;
            }
        }

        return sistema;
    }

    public Map<String, Object> extraerInformacionOpcion(String urlModulo) {
        Map<String, Object> sistemaActivo = extraerSistemaActivo();

        String sistema = (String) sistemaActivo.get("alias");

        urlModulo = sistema + "/" + urlModulo;

        List<Map<String, Object>> permisosUsuario = sesion.getPermisosUsuario();
        String urlModulo2;
        for (Map<String, Object> permisoUsuario : permisosUsuario) {
            urlModulo2 = sistema + "/" + (String) permisoUsuario.get("urlModulo");
            if (urlModulo2.equals(urlModulo)) {
                return permisoUsuario;
            }
        }
        return new HashMap<>();
    }

    public boolean permitirAcceso(String urlModulo) {
        Map<String, Object> sistemaActivo = extraerSistemaActivo();

        String sistema = (String) sistemaActivo.get("alias");

        urlModulo = sistema + "/" + urlModulo;

        List<Map<String, Object>> permisosUsuario = sesion.getPermisosUsuario();
        String urlModulo2;
        for (Map<String, Object> permisoUsuario : permisosUsuario) {
            urlModulo2 = sistema + "/" + (String) permisoUsuario.get("urlModulo");
            if (urlModulo2.equals(urlModulo)) {
                return true;
            }
        }
        return false;
    }

    public List<java.util.Map<String, Object>> extraerMenuUsuario() {
        List<java.util.Map<String, Object>> menuUsuario = sesion.getMenuUsuario();
        return menuUsuario;
    }

    public java.util.Map<String, Object> extraerDatosUsuario() {
        java.util.Map<String, Object> datosUsuario = sesion.getDatosUsuario();
        return datosUsuario;
    }

    public int extraerIdUsuario() {
        return sesion.getIdUsuario();
    }

}
