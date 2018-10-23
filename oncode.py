import json
import os
import pickle
import time
import uuid

from flask import Flask, request, render_template

app = Flask(__name__)
from concurrent.futures import ThreadPoolExecutor

executer = ThreadPoolExecutor(max_workers=10)
results = {}


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route("/fetch")
def fetch():
    pid = request.args.get('pid')
    file = f"tmp/{pid}_result.txt"
    result = {}
    if os.path.exists(file):
        with open(file, "rb") as f:
            try:
                result = pickle.load(f)
            except:
                pass
    result['pid'] = pid
    return json.dumps(result, indent=2)


def ex(pid, case, submit_code):
    print("running with " + f"{pid} / {case}")
    start = time.time()
    os.system(f"tmp.py {pid} {case[0]}")
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


@app.route('/execute', methods=['POST'])
def execute():
    question = {"call": "add(*sys.argv[2:])", "testcases": [("1 2", 3), ("3 4", 7), ("4 5", 9)]}
    result = {}
    code = "No Code"
    submit_code = code
    if request.method == 'POST':
        code = request.form['code']
        submit_code = code
        q = question["call"]
        code += f"""
import time
import sys
import pickle 
with open("tmp/" + sys.argv[1] + "_result.txt", "wb") as f:
    f.write(pickle.dumps({q}))
        """
    with open("tmp.py", "w") as f:
        f.write(code)
    result["pids"] = []
    for case in question["testcases"]:
        pid = str(uuid.uuid4())
        result["pids"].append(pid)
        executer.submit(ex, pid, case, submit_code)
    if request.form.get('json') == 'true':
        return json.dumps(result, indent=2)
    return render_template('execute.html', result=result)


if __name__ == '__main__':
    app.run()
