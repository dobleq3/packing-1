FROM grafana/grafana:latest

# Cambia a root temporalmente (opcional si instalas plugins)
USER root

# Instala plugins necesarios
RUN grafana-cli plugins install grafana-piechart-panel

# Copia archivos de configuración y dashboards
COPY provisioning /etc/grafana/provisioning
COPY dashboards /var/lib/grafana/dashboards

# Evita cambiar permisos innecesarios (esto causaba error)

# Cambia a usuario grafana para ejecutar de forma segura
USER grafana
