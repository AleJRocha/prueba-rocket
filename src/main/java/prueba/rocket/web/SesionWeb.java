package prueba.rocket.web;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 *
 */
public class SesionWeb implements Serializable {

    private int idUsuario;
    private Map<String, Object> datosUsuario;
    private Map<String, Object> sistemaActivo;
    private List<Map<String, Object>> menuUsuario;
    private List<Map<String, Object>> permisosUsuario;

    public SesionWeb() {

    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Map<String, Object> getDatosUsuario() {
        return datosUsuario;
    }

    public void setDatosUsuario(Map<String, Object> datosUsuario) {
        this.datosUsuario = datosUsuario;
    }

    public Map<String, Object> getSistemaActivo() {
        return sistemaActivo;
    }

    public void setSistemaActivo(Map<String, Object> sistemaActivo) {
        this.sistemaActivo = sistemaActivo;
    }

    public List<Map<String, Object>> getMenuUsuario() {
        return menuUsuario;
    }

    public void setMenuUsuario(List<Map<String, Object>> menuUsuario) {
        this.menuUsuario = menuUsuario;
    }

    public List<Map<String, Object>> getPermisosUsuario() {
        return permisosUsuario;
    }

    public void setPermisosUsuario(List<Map<String, Object>> permisosUsuario) {
        this.permisosUsuario = permisosUsuario;
    }

    @Override
    public String toString() {
        return "SesionWeb{" + "idUsuario=" + idUsuario + ", datosUsuario=" + datosUsuario + '}';
    }

}
