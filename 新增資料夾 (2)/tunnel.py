import http.server
import socketserver
import threading
import time

from pyngrok import ngrok

PORT = 8000

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    handler = SilentHandler
    httpd = socketserver.TCPServer(('', PORT), handler)

    print(f'本機伺服器已啟動： http://localhost:{PORT}')

    def serve_forever():
        with httpd:
            httpd.serve_forever()

    thread = threading.Thread(target=serve_forever, daemon=True)
    thread.start()

    public_url = ngrok.connect(PORT, "http").public_url
    print(f'公開網址： {public_url}')
    print('現在你可以在手機或其他裝置上開啟這個網址。')

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print('停止隧道與本機伺服器...')
        ngrok.disconnect(public_url)
        ngrok.kill()
        httpd.shutdown()
