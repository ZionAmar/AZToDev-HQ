FROM nginx:1.27-alpine

# Static company system map — no secrets, no build step
COPY index.html /usr/share/nginx/html/index.html
COPY README.md /usr/share/nginx/html/README.md

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
