import 'package:flutter/material.dart';

/// Driver Chat Page for La Maison des Wraps
/// Role: In-House Driver chatting with Customer & Kitchen Dispatch
class DriverChatView extends StatefulWidget {
  final String orderId;
  final String customerName;
  final String customerAddress;
  final String customerPhone;

  const DriverChatView({
    Key? key,
    this.orderId = "CMD-4092",
    this.customerName = "Jean Tremblay",
    this.customerAddress = "1450 Rue Saint-Pierre, Drummondville",
    this.customerPhone = "819 555-0192",
  }) : super(key: key);

  @override
  State<DriverChatView> createState() => _DriverChatViewState();
}

class _DriverChatViewState extends State<DriverChatView> {
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      "sender": "customer",
      "text": "Bonjour Marc, pourriez-vous sonner à l'interphone #204 en arrivant s'il vous plaît?",
      "time": "14:15",
      "isMe": false,
    },
    {
      "sender": "driver",
      "text": "Parfait Jean! C'est bien noté. Je suis à 3 minutes de chez vous avec votre sac isotherme.",
      "time": "14:18",
      "isMe": true,
    },
    {
      "sender": "driver",
      "text": "Je suis arrivé au 1450 Rue Saint-Pierre! Votre commande chaude est à votre porte.",
      "photo": "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500",
      "time": "14:22",
      "isMe": true,
    },
  ];

  void _sendMessage(String text, {String? photoUrl}) {
    if (text.trim().isEmpty && photoUrl == null) return;
    setState(() {
      _messages.add({
        "sender": "driver",
        "text": text.trim(),
        "photo": photoUrl,
        "time": "Maintenant",
        "isMe": true,
      });
      _textController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E1E1E),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Client: ${widget.customerName}",
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              widget.customerAddress,
              style: const TextStyle(color: Colors.white70, fontSize: 11),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.directions, color: Color(0xFFFF5500)),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.phone, color: Colors.greenAccent),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Order Pill Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFF1B2B1B),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: const [
                    Icon(Icons.check_circle, color: Colors.greenAccent, size: 16),
                    SizedBox(width: 6),
                    Text(
                      "Commande en cours de livraison",
                      style: TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                Text(
                  "#${widget.orderId}",
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),

          // Message Bubbles List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg["isMe"] == true;
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                    decoration: BoxDecoration(
                      color: isMe ? const Color(0xFFFF5500) : const Color(0xFF2A2A2A),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: isMe ? const Radius.circular(16) : Radius.zero,
                        bottomRight: isMe ? Radius.zero : const Radius.circular(16),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (msg["photo"] != null) ...[
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(msg["photo"], fit: BoxFit.cover),
                          ),
                          const SizedBox(height: 8),
                        ],
                        Text(
                          msg["text"],
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                        ),
                        const SizedBox(height: 4),
                        Align(
                          alignment: Alignment.bottomRight,
                          child: Text(
                            msg["time"],
                            style: TextStyle(color: isMe ? Colors.white70 : Colors.white38, fontSize: 10),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Driver Quick Action Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              children: [
                _buildQuickChip("Je suis en bas 🚗"),
                _buildQuickChip("À 2 minutes ⏱️"),
                _buildQuickChip("Commande déposée à la porte 📸"),
              ],
            ),
          ),

          // Input Bar with Camera Button
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            color: const Color(0xFF1E1E1E),
            child: SafeArea(
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.camera_alt, color: Color(0xFFFF5500)),
                    onPressed: () {
                      _sendMessage(
                        "📸 Photo de preuve de livraison déposée à votre porte!",
                        photoUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500",
                      );
                    },
                  ),
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: "Message au client...",
                        hintStyle: const TextStyle(color: Colors.white38),
                        filled: true,
                        fillColor: const Color(0xFF2A2A2A),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (val) => _sendMessage(val),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: const Color(0xFFFF5500),
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white, size: 20),
                      onPressed: () => _sendMessage(_textController.text),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickChip(String label) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ActionChip(
        backgroundColor: const Color(0xFF2A2A2A),
        label: Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
        onPressed: () => _sendMessage(label),
      ),
    );
  }
}
