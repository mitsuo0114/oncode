import json
from unittest import TestCase

from mock import MagicMock, patch
from nose.tools import eq_, assert_in

from ..oncodeserver import OnCodeServer, ex as execute_func


class TestOnCodeServer(TestCase):

    def setUp(self):
        self.patcher = patch("lib.oncodeserver.WebsocketServer")
        self.m_server = self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    def create_target(self):
        self.m_logger = MagicMock()

        self.m_client = MagicMock()
        # self.m_server = MagicMock()
        self.m_executer = MagicMock()

        target = OnCodeServer(port=100, logger=self.m_logger)
        target.run_forever = MagicMock()
        target.executer = self.m_executer
        return target

    def test_init(self):
        target = self.create_target()

        target.new_client(client=self.m_client, server=self.m_server)

        calls = self.m_server.send_message.call_args_list
        eq_(len(calls), 1)

        args = calls[0][1]
        eq_(args["client"], self.m_client)
        eq_(json.loads(args["msg"])["command"], "init")
        assert_in("content", json.loads(args["msg"]))

    def test_receive(self):
        target = self.create_target()

        message = json.dumps({"code": "print(1)", "program_id": "level0-add"})
        target.message_received(client=self.m_client,
                                server=self.m_server,
                                message=message)

        calls = self.m_executer.submit.call_args_list
        eq_(len(calls), 3)

        args = calls[0][0]
        eq_(args[1], 0)
        eq_(args[2].count("-"), 4)
        eq_(args[3], {'input': [1, 2], 'expect': 3})
        eq_(args[4], "print(1)")
        eq_(args[5], f'add(##TESTCASE##)')
        # eq_(args[6], self.m_server)
        eq_(args[7], self.m_client)
        eq_(args[8], self.m_logger)
        # eq_(args["i"], 0)
        # eq_(args["pid"].count("-"), 4)
        # eq_(args["case"], {'input': [1, 2], 'expect': 3})
        # eq_(args["original_code"], "print(1)")
        # eq_(args["client"], self.m_client)
        # eq_(args["logger"], self.m_logger)
        # eq_(args["script"], f'tmp_{args["pid"]}.py')

    def test_receive_invalid_program_id(self):
        target = self.create_target()

        message = json.dumps({"code": "print(1)", "program_id": "hoge"})
        target.message_received(client=self.m_client,
                                server=self.m_server,
                                message=message)

        calls = self.m_executer.submit.call_args_list
        eq_(len(calls), 0)

    # def test_execution(self):
    #     execute_func(0, "dummy", )