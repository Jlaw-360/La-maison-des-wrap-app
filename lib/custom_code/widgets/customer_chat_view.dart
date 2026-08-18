import 'package:flutter/material.dart';

/// Customer Chat Page for La Maison des Wraps
/// Role: Customer chatting with In-House Driver and Store Kitchen
class CustomerChatView extends StatefulWidget {
  final String orderId;
  final String customerName;
  final String driverName;
  final String driverVehicle;
  final String driverPhone;

  const CustomerChatView({
    Key? key,
    this.orderId = "CMD-4092",
    this.customerName = "Jean Tremblay",
    this.driverName = "Marc Livreur",
    this.driverVehicle = "Honda Civic Noir (QC)",
    this.driverPhone = "819 555-0841",
  }) : super(key: key);

  @override
  State<CustomerChatView> createState() => _CustomerChatViewState();
}

class _CustomerChatViewState extends State<CustomerChatView> {
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      "sender": "customer",
      "text": "Bonjour Marc, pourriez-vous sonner à l'interphone #204 en arrivant s'il vous plaît?",
      "time": "14:15",
      "isMe": true,
    },
    {
      "sender": "driver",
      "text": "Parfait Jean! C'est bien noté. Je suis à 3 minutes de chez vous avec votre sac isotherme.",
      "time": "14:18",
      "isMe": false,
    },
    {
      "sender": "driver",
      "text": "Je suis arrivé au 1450 Rue Saint-Pierre! Votre commande chaude est à votre porte.",
      "photo": "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500",
      "time": "14:22",
      "isMe": false,
    },
  ];

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        "sender": "customer",
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
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: const Color(0xFFFF5500),
              child: const Icon(Icons.delivery_dining, color: Colors.white),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.driverName,
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  "${widget.driverVehicle} · En route",
                  style: const TextStyle(color: Color(0xFFFF5500), fontSize: 12),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone, color: Color(0xFFFF5500)),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Order Header Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: const Color(0xFF242424),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Commande #${widget.orderId} (998 110e Ave)",
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF5500).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    "LIVRAISON EN DIRECT",
                    style: TextStyle(color: Color(0xFFFF5500), fontSize: 10, fontWeight: FontWeight.bold),
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

          // Quick Preset Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              children: [
                _buildQuickChip("Sonner à l'interphone"),
                _buildQuickChip("Laisser à la porte"),
                _buildQuickChip("Je descends"),
                _buildQuickChip("Merci!"),
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
                        hintText: "Écrivez au livreur...",
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
