import 'package:flutter/material.dart';

/// Store / Kitchen Chat Management View for La Maison des Wraps
/// Role: Kitchen Chef chatting with Customers and Drivers
class StoreChatView extends StatefulWidget {
  final String orderId;
  final String customerName;
  final String customerPhone;
  final List<String> orderSummary;

  const StoreChatView({
    Key? key,
    this.orderId = "CMD-4092",
    this.customerName = "Jean Tremblay",
    this.customerPhone = "819 555-0192",
    this.orderSummary = const [
      "2x Kebab Poulet Naan Trio",
      "1x Lassi Mangue",
    ],
  }) : super(key: key);

  @override
  State<StoreChatView> createState() => _StoreChatViewState();
}

class _StoreChatViewState extends State<StoreChatView> {
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      "sender": "customer",
      "text": "Bonjour, j'ai une légère intolérance aux arachides, pourriez-vous vous assurer qu'il n'y en a pas dans le curry?",
      "time": "14:02",
      "isMe": false,
    },
    {
      "sender": "store",
      "text": "Bonjour Jean! Rassurez-vous, nos recettes de wraps et curries sont 100% sans arachides. Votre wrap Kebab Naan est bien préparé avec extra sauce à l'ail comme demandé!",
      "time": "14:05",
      "isMe": true,
    },
  ];

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        "sender": "store",
        "text": text.trim(),
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
              "Commande #${widget.orderId} · Cuisine Drummondville",
              style: const TextStyle(color: Color(0xFFFF5500), fontSize: 11),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone, color: Colors.greenAccent),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Ticket Summary Card
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFF222222),
            child: Row(
              children: [
                const Icon(Icons.restaurant_menu, color: Color(0xFFFF5500), size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "Articles: ${widget.orderSummary.join(', ')}",
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                    overflow: TextOverflow.ellipsis,
                  ),
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

          // Kitchen Quick Response Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              children: [
                _buildQuickChip("C'est en préparation! 👨‍🍳"),
                _buildQuickChip("Prêt pour le livreur 📦"),
                _buildQuickChip("100% Halal & Sans arachides ✅"),
                _buildQuickChip("Extra sauce ajoutée! 🥫"),
              ],
            ),
          ),

          // Input Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            color: const Color(0xFF1E1E1E),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: "Répondre au client...",
                        hintStyle: const TextStyle(color: Colors.white38),
                        filled: true,
                        fillColor: const Color(0xFF2A2A2A),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: _sendMessage,
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
