import json
import uuid

from concurrent.futures import ThreadPoolExecutor

from lib.code_executor import CodeExecutor
from lib.websocketserver import WebsocketServer


class OnCodeServer:

    def __init__(self, port, logger):
        self.logger = logger
        self.executer = ThreadPoolExecutor(max_workers=10)
        self.results = {}
        self.program_data = {}

        self.server = self._create_server(port, logger)
        self.server.new_client_callback = self.new_client
        self.server.client_left_callback = self.client_left
        self.server.message_received_callback = self.message_received

        self._load_program()

    def _create_server(self, port, logger):
        return WebsocketServer(port, host="0.0.0.0", logger=logger)

    def _load_program(self):
        with open("res/program.json", encoding="utf8") as f:
            self.program_data = dict(json.load(f))

    def run_forever(self):
        self.server.run_forever()

    def new_client(self, client, server):
        self.logger.debug("New client connected and was given id %d" % client['id'])
        message = {
            "command": "init",
            "content": self.program_data
        }
        server.send_message(client=client, msg=json.dumps(message))

    def client_left(self, client, server):
        self.logger.debug("Client(%d) disconnected" % client['id'])

    def message_received(self, client, server, message):
        self.logger.info("Client(%d) submitted %s" % (client['id'], message))
        self.execute(server, client, message)

    def execute(self, server, client, code):
        inputdata = json.loads(code)
        original_code = inputdata["code"]
        program_id = inputdata["program_id"]
        if program_id not in self.program_data:
            self.logger.warning("Invalid Program id")
            return

        testcases = self.program_data[program_id]["testcases"]
        for i, case in enumerate(testcases):
            pid = str(uuid.uuid4())
            call_code = self.program_data[program_id]["call"]
            self.executer.submit(CodeExecutor.ex, i, pid, case, original_code, call_code, server, client, self.logger)
