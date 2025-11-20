#  Spotify Clone App

A full-featured **React Native / Expo** application that replicates Spotify’s design and functionality. Includes multi-screen navigation, offline caching, advanced animations, and complete accessibility support.

---

##  Features

### **Core Functionality**
- **Multi-Screen Navigation** – Profile, Settings, and Playlists via drawer navigation  
- **Authentication System** – Login/signup flow with form validation  
- **Offline Navigation Caching** – Persistent state using AsyncStorage  
- **Spotify Design Language** – Dark theme UI with green accent `#1DB954`  
- **Responsive Layout** – Works on multiple screen sizes and platforms  

### **Advanced Features**
- **Animated Drawer Navigation** with smooth transitions  
- **Navigation State Persistence** across restarts  
- **Haptic Feedback** for success, error, and interactions  
- **Loading States** for async operations  
- **Cross-Platform Support** – Web, iOS, and Android  

### **Accessibility Features**
- Screen reader support (VoiceOver/TalkBack)  
- Dynamic font scaling support  
- Keyboard navigation and focus management  
- High-contrast text readability  

---

##  Screenshots & Weekly Progress

### **📌 Week 1 – Component Showcase**
Week 1 screenshot demonstrates:
- Buttons  
- Text fields  
- Scroll views  

### **📌 Week 2 – Accessibility Implementation**
Screenshot shows:
- “Add Dynamic Components” section  
- Dynamically added button and image  
- Accessibility-friendly UI  

### **📌 Week 2 – Multi-Screen Navigation Demo**
Video includes:
- Drawer navigation  
- Navigation persistence  
- Smooth transitions  

### **📌 Week 3 – Advanced Navigation**
Features implemented:
- Gesture-based drawer (velocity & threshold handling)  
- Drawer state saved in AsyncStorage  
- Screen transitions:
  - Slide (300ms) for Profile/Settings  
  - Fade (200ms) for Sign-Up  
  - Drawer scale animation (down to 90%)  
- Restores last screen + drawer position on restart  
- Error handling and fallbacks for edge cases  

### **📌 Week 4 Activity 1 – State Management**
Uses:
- React Hooks for local state  
- AsyncStorage for persistent navigation data  
- Unit + integration testing  
- Error boundaries and consistency checks  

### **📌 Week 4 Activity 2 – Profile Creation Form**
Includes:
- Real-time profile preview  
- Client-side validation:
  - Username (3–20 chars, alphanumeric + underscore)  
  - Email regex validation  
  - Required genre selection  
- Animated shake effect on errors  
- Fade transitions for profile preview  
- Haptic feedback on interactions  
- Optimized rendering using React.memo  

---




Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
