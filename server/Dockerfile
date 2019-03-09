FROM python:3.7
ADD . .
RUN pip install -r requirements.txt

EXPOSE 9001
CMD ["python", "websocket_server.py"]
