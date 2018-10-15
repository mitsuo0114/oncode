import os
import pickle
import time

from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/execute', methods=['POST'])
def execute():
    question = {"call": "add(*sys.argv[1:])", "testcases": [("1 2", 3), ("3 4", 7), ("4 5", 9)]}
    result = {}
    code = "No Code"
    if request.method == 'POST':
        code = request.form['code']
        q = question["call"]
        code += f"""
import sys
import pickle 
with open("result.txt", "wb") as f:
    f.write(pickle.dumps({q}))
        """
    with open("tmp.py", "w") as f:
        f.write(code)
    result["tests"] = []
    # subprocess.call(["tmp.py", "1", "2"])
    for case in question["testcases"]:
        results = {"input": case[0]}
        start = time.time()
        os.system(f"tmp.py {case[0]}")
        end = time.time()
        with open("result.txt", "rb") as f:
            results["result"] = pickle.load(f)
        results["expect"] = case[1]
        results["verdict"] = (results["result"] == case[1])
        results["spent_time"] = "%-0.5f sec" % (end - start)
        result["tests"].append(results)
    result["executed_code"] = code[:]

    return render_template('execute.html', result=result)


if __name__ == '__main__':
    app.run()
