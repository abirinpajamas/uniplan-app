<?php
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Predis\Client;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require __DIR__ . '/vendor/autoload.php';

class LikeHandler implements MessageComponentInterface {
    protected $clients; 
    protected $commentAuthors = []; 
    protected $redis;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->redis = new Client('tcp://127.0.0.1:6379'); 
        $this->redis->connect();
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg);

        if ($data) {
            if ($data->type === 'identify_user' && isset($data->userId)) {
                $this->clients[$from] = $data->userId;
                echo "User {$data->userId} identified connection {$from->resourceId}\n";
            } elseif ($data->type === 'new_like') {
                $commentId = $data->commentId;
                $likerId = $data->likerId;

                $authorId = $this->getCommentAuthorId($commentId); 

                if ($authorId && $likerId !== $authorId) {
                    foreach ($this->clients as $client) {
                        if ($this->clients[$client] === $authorId) {
                            // 3. Send the notification only to the author
                            $client->send(json_encode(['type' => 'new_like', 'commentId' => $commentId, 'likerId' => $likerId]));
                            echo "Sent like notification for comment {$commentId} to user {$authorId}.\n";
                            break; 
                        }
                    }
                }
            }
            // Handle other message types if needed
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    private function getCommentAuthorId($commentId) {
        
        include("php/database.php"); 
        $stmt = $conn->prepare("SELECT user_idno FROM facultyreview WHERE comment_num = ?");
        $stmt->bind_param("i", $commentId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result ? $result->fetch_assoc() : null;
        $stmt->close();
        return $row ? $row['user_idno'] : null;
        
       
        
    }
}

$server = IoServer::factory(
    new WsServer(
        new LikeHandler()
    ),
    8080,
     '0.0.0.0'
);

echo "WebSocket server started on port 8080\n";
$server->run();
?>