import os
import pickle
import uuid
import time
from concurrent.futures import ThreadPoolExecutor

from flask import Flask, request, render_template

app = Flask(__name__)

executor = ThreadPoolExecutor(max_workers=10)
worker_map = {}

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/fetch', methods=['GET'])
def fetch():
    pid = request.args.get('pid')
    result = {}
    result["tests"] = []
    with open(pid + "_result.txt", "rb") as f:
        result["result"] = pickle.load(f)
    with open(pid + "_case.txt", "rb") as f:
        result["case"] = pickle.load(f)
    # result["expect"] = case[1]
    # result["verdict"] = (result["result"] == case[1])
    # result["spent_time"] = "%-0.5f sec" % (end - start)
    # result["tests"].append(results)
    # result["executed_code"] = code[:]



@app.route('/execute', methods=['POST'])
def execute():
    question = {"call": "add(*sys.argv[2:])", "testcases": [("1 2", 3), ("3 4", 7), ("4 5", 9)]}
    code = "No Code"
    if request.method == 'POST':
        code = request.form['code']
        q = question["call"]
        runcode = f"""
{code}

import sys
import pickle
import time 
with open(sys.argv[1] + "_result.txt", "wb") as f:
    start = time.time()
    result = {{}}
    result["output"] = {q}
    end = time.time()
    f.write(pickle.dumps(result))
    
    time.sleep(1)
        """
        with open("tmp.py", "w") as f:
            f.write(runcode)

    # subprocess.call(["tmp.py", "1", "2"])
        for case in question["testcases"]:
            pid = str(uuid.uuid4())
            case = {"input": case[0], "expect" : case[1], "code" : runcode}
            print(pid, case)
            def ex():
                print("excuting.." + f"tmp.py {pid} {case[0]}")
                # os.system(f"tmp.py {pid} {case[0]}")
            executor.submit(ex)

            with open(pid+ "_case.txt", "wb") as f:
                f.write(pickle.dumps(case))

    return render_template('execute.html', result={})


if __name__ == '__main__':
    app.run()
