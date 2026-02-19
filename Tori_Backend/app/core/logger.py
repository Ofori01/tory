import logging
import queue

# Shared log queue for SSE
log_queue = queue.Queue()

class SSELogHandler(logging.Handler):
    def emit(self, record):
        msg = self.format(record)
        log_queue.put(msg)

def setup_logger():
    logger = logging.getLogger("tori")
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter('[%(levelname)s] %(asctime)s - %(message)s')

    if not logger.hasHandlers():
        # Console handler
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(formatter)
        logger.addHandler(ch)

        # SSE handler
        sse_handler = SSELogHandler()
        sse_handler.setLevel(logging.DEBUG)
        sse_handler.setFormatter(formatter)
        logger.addHandler(sse_handler)

    return logger
