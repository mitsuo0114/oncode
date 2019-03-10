import json
import os
import pickle
import time
import uuid

from concurrent.futures import ThreadPoolExecutor
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
        result = {}
        inputdata = json.loads(code)
        original_code = inputdata["code"]
        program_id = inputdata["program_id"]
        if program_id not in self.program_data:
            self.logger.warning("Invalid Program id")
            return

        testcases = self.program_data[program_id]["testcases"]
        result["pids"] = []
        for i, case in enumerate(testcases):
            pid = str(uuid.uuid4())
            q = self.program_data[program_id]["call"]
            q = q.replace("##TESTCASE##", ",".join(map(str, case["input"])))
            code = original_code + "\n".join([
                "",
                "import time",
                "import sys",
                "import pickle",
                f'with open("tmp/{pid}_result.txt", "wb") as f:',
                f"    f.write(pickle.dumps({q}))",
                ""
            ])
            script = f"tmp_{pid}.py"
            with open(f"tmp/{script}", "w") as f:
                f.write(code)
            result["pids"].append(pid)

            def ex(i, pid, case, submit_code, script, server, client):
                self.logger.debug("running with " + f"{pid} / {case}")
                start = time.time()
                self.logger.debug(f"executing [tmp/{script} {pid} {case['input']}]")
                s = os.sep
                os.system(f"python tmp{s}{script}")
                end = time.time()
                message = {}
                with open(f"tmp/{pid}_result.txt", "rb") as f:
                    message["output"] = pickle.load(f)
                message["index"] = i
                message["input"] = case["input"]
                message["expect"] = case["expect"]
                message["verdict"] = (message["expect"] == message["output"])
                message["spent_time"] = "%-0.5f sec" % (end - start)
                message["executed_code"] = submit_code
                with open(f"tmp/{pid}_result.txt", "wb") as f:
                    f.write(pickle.dumps(message))
                self.logger.debug("outputted to " + f"{pid}_result.txt")
                message["command"] = "show_testresult"
                server.send_message(client, json.dumps(message))

            self.executer.submit(fn=ex, i=i, pid=pid, case=case, original_code=original_code,
                                 script=script, server=server, client=client)
