# Original Source : https://github.com/Pithikos/python-websocket-server/blob/master/websocket_server/websocket_server.py
# Author: Johan Hanssen Seferidis
# License: MIT

import logging

from socketserver import ThreadingMixIn, TCPServer
from .websockethandler import WebSocketHandler


class WebsocketServer(ThreadingMixIn, TCPServer):

    def __init__(self, port, host='127.0.0.1', logger=None):
        TCPServer.__init__(self, (host, port), WebSocketHandler)
        self.logger = logging.getLogger(__name__)
        if logger:
            self.logger = logger
        self.port = self.socket.getsockname()[1]

        self.clients = []
        self.id_counter = 0
        self.new_client_callback = None
        self.client_left_callback = None
        self.message_received_callback = None

    def send_message(self, client, msg):
        self.logger.info(f"Send Message to Client({client['id']}) / message : {msg}")
        self._unicast_(client, msg)

    def send_message_to_all(self, msg):
        self._multicast_(msg)

    def _message_received_(self, handler, msg):
        self.message_received_callback(self.handler_to_client(handler), self, msg)

    def _ping_received_(self, handler, msg):
        handler.send_pong(msg)

    def _pong_received_(self, handler, msg):
        pass

    def _new_client_(self, handler):
        self.id_counter += 1
        client = {
            'id': self.id_counter,
            'handler': handler,
            'address': handler.client_address
        }
        self.clients.append(client)
        self.new_client_callback(client, self)

    def _client_left_(self, handler):
        self.client = self.handler_to_client(handler)

        if self.client_left_callback:
            self.client_left_callback(self.client, self)

        if self.client in self.clients:
            self.clients.remove(self.client)

    def _unicast_(self, to_client, msg):
        to_client['handler'].send_message(msg)

    def _multicast_(self, msg):
        for self.client in self.clients:
            self._unicast_(self.client, msg)

    def handler_to_client(self, handler):
        for self.client in self.clients:
            if self.client['handler'] == handler:
                return self.client

    def run_forever(self):
        try:
            self.logger.info("Listening on port %d for clients.." % self.port)
            self.serve_forever()
        except KeyboardInterrupt:
            self.server_close()
            self.logger.info("Server terminated.")
        except Exception as e:
            self.logger.error(str(e), exc_info=True)
            exit(1)
