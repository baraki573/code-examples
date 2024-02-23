FROM quay.io/keycloak/keycloak AS build
WORKDIR /opt/keycloak
COPY custom /opt/keycloak/themes/custom
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak
COPY --from=build /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
EXPOSE 9009
