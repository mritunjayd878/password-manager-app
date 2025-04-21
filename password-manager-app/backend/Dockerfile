# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Create a startup script
RUN echo '#!/bin/sh\npython database.py\npython app.py' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
