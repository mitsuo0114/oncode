import json
import os
import pickle
import time
import uuid

import logging
from concurrent.futures import ThreadPoolExecutor

from libs.websocketserver import WebsocketServer

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(name)-12s %(funcName)-7s %(levelname)-7s  %(message)s"))
logger.addHandler(handler)
logger.propagate = False

program_data = {
    "level0-add": {
        "program_id": "level0-add",
        "short_title": "Add",
        "question": "変数二つを足す関数を作成する。",
        "initial_code": ["def add(a, b):\n    return a + b"],
        "function_params": ["a", "b"],
        "testcases": [
            {
                "input": [1, 2],
                "expect": 3
            },
            {
                "input": [-1, 6],
                "expect": 5
            },
            {
                "input": [4, 5],
                "expect": 9
            }
        ],
    },
    "level0-sub": {
        "program_id": "level0-sub",
        "short_title": "Sub",
        "question": "変数二つを引く関数を作成する。",
        "initial_code": ["def sub(a, b):\n    return a - b"],
        "function_params": ["a", "b"],
        "testcases": [
            {
                "input": [2, 1],
                "expect": 1
            },
            {
                "input": [-1, 6],
                "expect": -7
            }
        ],
    },
    "level0-mul": {
        "program_id": "level0-mul",
        "short_title": "Mul",
        "question": "変数二つをかける関数を作成する。",
        "initial_code": ["def mul(a, b):\n    return a * b"],
        "function_params": ["a", "b"],
        "testcases": [
            {
                "input": [2, 1],
                "expect": 2
            },
            {
                "input": [-1, 6],
                "expect": -6
            }
        ],
    }
}


class OnCodeServer:

    def __init__(self, port, level):
        self.executer = ThreadPoolExecutor(max_workers=10)
        self.results = {}
        self.server = WebsocketServer(port, loglevel=level)
        self.server.set_fn_new_client(self.new_client)
        self.server.set_fn_client_left(self.client_left)
        self.server.set_fn_message_received(self.message_received)

    def run_forever(self):
        self.server.run_forever()

    def new_client(self, client, server):
        logger.debug("New client connected and was given id %d" % client['id'])
        message = {"command": "init",
                   "content": program_data
                   }
        # server.send_message_to_all("Hey all, a new client has joined us")
        server.send_message(client, json.dumps(message))

    def client_left(self, client, server):
        logger.debug("Client(%d) disconnected" % client['id'])

    def execute(self, server, code):
        question = {
            "initial": [
                "def add(param1, param2):",
                "    return int(param1) + int(param2)"
            ],
            "call": "add(##TESTCASE##)",
            "testcases":
                [("1,2", 3), ("3,4", 7), ("4,5", 9)]
        }

        result = {}
        original_code = code

        result["pids"] = []
        for i, case in enumerate(question["testcases"]):
            pid = str(uuid.uuid4())
            q = question["call"]
            q = q.replace("##TESTCASE##", case[0])
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

            def ex(i, pid, case, submit_code, script, server):
                logger.debug("running with " + f"{pid} / {case}")
                start = time.time()
                logger.debug(f"executing [tmp/{script} {pid} {case[0]}]")
                os.system(f"tmp\\{script}")
                end = time.time()
                message = {}
                with open(f"tmp/{pid}_result.txt", "rb") as f:
                    message["output"] = pickle.load(f)
                message["index"] = i
                message["input"] = case[0].split(",")
                message["expect"] = case[1]
                message["verdict"] = (message["output"] == case[1])
                message["spent_time"] = "%-0.5f sec" % (end - start)
                message["executed_code"] = submit_code
                with open(f"tmp/{pid}_result.txt", "wb") as f:
                    f.write(pickle.dumps(message))
                logger.debug("outputted to " + f"{pid}_result.txt")
                message["command"] = "show_testresult"
                server.send_message_to_all(json.dumps(message))

            self.executer.submit(ex, i, pid, case, original_code, script, server)

    def message_received(self, client, server, message):
        if len(message) > 200:
            message = message[:200] + '..'
        text = "Client(%d) submitted %s" % (client['id'], message)
        # server.send_message_to_all(text)
        self.execute(server, message)


if __name__ == "__main__":
    PORT = 9001
    log_level = logging.DEBUG
    handler.setLevel(log_level)
    logger.setLevel(log_level)

    server = OnCodeServer(PORT, log_level)
    server.run_forever()
