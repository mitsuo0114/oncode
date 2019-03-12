import json
import os
import pickle
import time


class CodeExecutor:

    @staticmethod
    def _create_testscript(submit_code, case_input, call_code, pid):
        call_code = call_code.replace("##TESTCASE##", ",".join(map(str, case_input)))

        surpress_code = "\n".join([
            "import builtins",
            "replaces = [",
            "    'open', '__import__', 'eval', 'dir', 'exec',",
            "    'globals', 'locals', 'help', 'id', 'input', 'memoryview'",
            "]",
            "allow_import = ['collections', 'itertools']",
            "originals = {}",
            "def d(*a):",
            "    if a[0] in allow_import:",
            "        return originals['__import__'](*a)",
            "    return None",
            "for r in replaces:",
            "    originals[r] = getattr(builtins, r)",
            "    setattr(builtins, r, lambda *a: a)",
            "builtins.__import__ = d",
            ""
        ])

        output_code = "\n".join([
            "",
            "",
            f"data = {call_code}",
            "for r in replaces:",
            "    setattr(builtins, r, originals[r])",
            "import pickle",
            f"with open('tmp/{pid}_result.txt', 'wb') as f:",
            f"    f.write(pickle.dumps(data))",
            ""
        ])

        code = surpress_code + submit_code + output_code
        return code

    @staticmethod
    def _actual_execute(code, pid):
        script = f"tmp_{pid}.py"
        with open(f"tmp/{script}", "w") as f:
            f.write(code)
        s = os.sep
        start = time.time()
        os.system(f"python tmp{s}{script}")
        end = time.time()
        return start, end

    @staticmethod
    def _create_response(start, end, index, pid, case, submit_code):
        message = {
            "index": index,
            "input": case["input"],
            "expect": case["expect"],
            "executed_code": submit_code,
            "command": "show_testresult",
            "spent_time": "%-0.5f sec" % (end - start)
        }
        with open(f"tmp/{pid}_result.txt", "rb") as f:
            message["output"] = pickle.load(f)
        message["verdict"] = (message["expect"] == message["output"])

        return message

    @staticmethod
    def ex(i, pid, case, submit_code, call_code, server, client, logger):
        logger.debug("running with " + f"{pid} / {case}")
        code = CodeExecutor._create_testscript(submit_code, case["input"], call_code, pid)

        logger.debug(f"executing [{pid} {case['input']}]")
        start, end = CodeExecutor._actual_execute(code, pid)

        logger.debug("outputted to " + f"{pid}_result.txt")
        message = CodeExecutor._create_response(start, end, i, pid, case, submit_code)

        server.send_message(client, json.dumps(message))
