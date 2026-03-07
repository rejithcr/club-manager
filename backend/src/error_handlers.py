import json
import logging


def generic_error_handler(error):
    logging.error(f"Unhandled Exception: {str(error)}", exc_info=True)
    return {"error": str(error.original_exception) if hasattr(error, 'original_exception') else str(error)}, 500