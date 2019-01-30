# Original Source : https://github.com/Pithikos/python-websocket-server
# Author: Johan Hanssen Seferidis
# License: MIT

import json
import os
import pickle
import time
import uuid

import logging
from concurrent.futures import ThreadPoolExecutor

from lib.websocketserver import WebsocketServer

executer = ThreadPoolExecutor(max_workers=10)
results = {}


def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])
    server.send_message_to_all("Hey all, a new client has joined us")


# Called for every client disconnecting
def client_left(client, server):
    print("Client(%d) disconnected" % client['id'])


def ex(pid, case, submit_code, script, server):
    print("running with " + f"{pid} / {case}")
    start = time.time()
    print(f"executing [tmp/{script} {pid} {case[0]}]")
    os.system(f"tmp\\{script}")
    end = time.time()
    result = {}
    with open(f"tmp/{pid}_result.txt", "rb") as f:
        result["result"] = pickle.load(f)
    result["input"] = case[0]
    result["expect"] = case[1]
    result["verdict"] = (result["result"] == case[1])
    result["spent_time"] = "%-0.5f sec" % (end - start)
    result["executed_code"] = submit_code
    with open(f"tmp/{pid}_result.txt", "wb") as f:
        f.write(pickle.dumps(result))
    print("outputted to " + f"{pid}_result.txt")
    server.send_message_to_all(json.dumps(result, indent=2))


def execute(server, code):
    question = {"call": "add(##TESTCASE##)", "testcases": [("1,2", 3), ("3,4", 7), ("4,5", 9)]}
    result = {}
    original_code = code

    result["pids"] = []
    for case in question["testcases"]:
        pid = str(uuid.uuid4())
        q = question["call"]
        q = q.replace("##TESTCASE##", case[0])
        code = original_code + f"""
import time
import sys
import pickle 
with open("tmp/{pid}_result.txt", "wb") as f:
    f.write(pickle.dumps({q}))
"""
        script = f"tmp_{pid}.py"
        with open(f"tmp/{script}", "w") as f:
            f.write(code)
        result["pids"].append(pid)
        executer.submit(ex, pid, case, original_code, script, server)


def message_received(client, server, message):
    if len(message) > 200:
        message = message[:200] + '..'
    text = "Client(%d) submitted %s" % (client['id'], message)
    server.send_message_to_all(text)
    execute(server, message)


if __name__ == "__main__":
    PORT = 9001
    server = WebsocketServer(PORT, loglevel=logging.DEBUG)
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    server.set_fn_message_received(message_received)
    server.run_forever()
