import logging

from lib.oncodeserver import OnCodeServer

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(name)-12s %(funcName)-7s %(levelname)-7s  %(message)s"))
logger.addHandler(handler)
logger.propagate = False

log_level = logging.INFO
handler.setLevel(log_level)
logger.setLevel(log_level)

if __name__ == "__main__":
    PORT = 9001
    logger.info("Initializing...")
    server = OnCodeServer(PORT, logger)
    logger.info("server started")
    server.run_forever()
