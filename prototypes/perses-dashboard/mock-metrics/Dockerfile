FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY generate_metrics.py .

EXPOSE 8000

CMD ["python", "generate_metrics.py"]
