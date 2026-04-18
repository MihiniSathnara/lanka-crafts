import 'dotenv/config';
import ChatbotQA from '../models/ChatbotQA.js';

const qaData = [
  {
    question: 'How does LankaCrafts work?',
    answer: 'LankaCrafts connects tourists with talented Sri Lankan artisans. You can browse crafts, explore artist profiles, book workshops, and chat directly with artists. Tourists can register, discover local crafts, attend workshops, and leave reviews.',
    category: 'general',
    keywords: ['how', 'work', 'platform', 'lankacrafts', 'what is'],
  },
  {
    question: 'How do I register as a tourist?',
    answer: 'Click the Register button in the top navigation bar. Select "Tourist" as your role, then fill in your name, email, password, phone number, country, and NIC/passport number. After registration, you will be redirected to login.',
    category: 'registration',
    keywords: ['register', 'sign up', 'tourist', 'create account'],
  },
  {
    question: 'How do I register as an artist?',
    answer: 'Click Register in the navbar and select "Artist". Fill in your full details including name, email, password, bio, craft specialization, workshop name, location (address, latitude, longitude), and phone number. After registration, log in to access your artist dashboard.',
    category: 'registration',
    keywords: ['register', 'sign up', 'artist', 'artisan'],
  },
  {
    question: 'How do I book a workshop?',
    answer: 'You can book a workshop in two ways: (1) Visit an artist\'s profile page and select an available time slot, or (2) Click "Workshop Booking" in the navbar, select the craft specialization, choose an artist, and pick an available slot. After booking, a QR code is generated for your session.',
    category: 'booking',
    keywords: ['book', 'workshop', 'booking', 'reserve', 'schedule'],
  },
  {
    question: 'Can I cancel a booking?',
    answer: 'Tourists cannot cancel bookings directly. To cancel a booking, please contact the artist through the chat feature in your dashboard. The artist will handle the cancellation on their end.',
    category: 'booking',
    keywords: ['cancel', 'cancellation', 'refund', 'remove booking'],
  },
  {
    question: 'How do I chat with an artist?',
    answer: 'Once logged in as a tourist, you can start a chat from the craft detail page by clicking "Chat with Artist", or from the artist\'s profile page. All your conversations are accessible from the "Chats" section of your tourist dashboard.',
    category: 'communication',
    keywords: ['chat', 'message', 'contact', 'talk', 'communicate'],
  },
  {
    question: 'What crafts are available on LankaCrafts?',
    answer: 'LankaCrafts features a wide variety of traditional Sri Lankan crafts including batik, handloom textiles, wooden carvings, lacquerware, pottery, metalwork, coir products, and mask making. Browse the Craft List in the navbar to see all available items.',
    category: 'crafts',
    keywords: ['crafts', 'items', 'products', 'available', 'types', 'categories'],
  },
  {
    question: 'How do I find workshops near me?',
    answer: 'Visit the "Sri Lanka Map" section in the navbar to see all artist workshop locations marked on an interactive map. Click any marker to see the artist\'s details and a link to their profile.',
    category: 'map',
    keywords: ['map', 'location', 'find', 'nearby', 'where'],
  },
  {
    question: 'How do I leave a review?',
    answer: 'After attending a workshop, you can leave a review on the artist\'s profile page. Scroll down to the Reviews section, select a star rating, write your comment, and submit. Reviews help other tourists discover great artists.',
    category: 'reviews',
    keywords: ['review', 'rating', 'feedback', 'rate', 'comment'],
  },
  {
    question: 'Is my booking confirmed immediately?',
    answer: 'Yes! Once you complete the booking process, your booking is immediately confirmed and the selected time slot is blocked so no other tourist can book it. You will receive a QR code for your booking.',
    category: 'booking',
    keywords: ['confirmed', 'immediate', 'instant', 'double booking'],
  },
];

export const seedChatbot = async () => {
  try {
    const count = await ChatbotQA.countDocuments();
    if (count === 0) {
      await ChatbotQA.insertMany(qaData);
      console.log('Chatbot Q&A seeded successfully');
    }
  } catch (error) {
    console.error('Chatbot seed error:', error.message);
  }
};

export default seedChatbot;
