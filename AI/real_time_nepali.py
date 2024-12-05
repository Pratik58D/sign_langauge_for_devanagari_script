import cv2
import mediapipe as mp
import joblib
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Loading the trained SVM model and label encoder
svm_model = joblib.load('svm_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

#it  Initialize MediaPipe hands model
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)

# Initialize VideoCapture
cap = cv2.VideoCapture(0)

# Load the Nepali font
font_path = './NotoSansDevanagari-Regular.ttf'  
font = ImageFont.truetype(font_path, 40)

# Real-time hand gesture recognition
while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Failed to capture image.")
        break

    # Convert the BGR image to RGB and process with MediaPipe
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Collect hand landmarks (21 points with (x, y, z) coordinates)
            hand_data = []
            for landmark in hand_landmarks.landmark:
                hand_data.extend([landmark.x, landmark.y, landmark.z])

            # Prepare the data for the model
            hand_data = np.array(hand_data).reshape(1, -1)

            # Make a prediction using the trained SVM model
            predicted_label = svm_model.predict(hand_data)
            predicted_label = label_encoder.inverse_transform(predicted_label)

            # Print the prediction to the console
            print(f"Predicted: {predicted_label[0]}")

            # Convert the OpenCV image to a Pillow image for text rendering
            pil_image = Image.fromarray(image)
            draw = ImageDraw.Draw(pil_image)

            # Clear any existing text on the image before drawing the new prediction
            pil_image.paste((0, 0, 0), [0, 0, pil_image.size[0], 50])  # This clears the area where text might be

            # Display the predicted label in Nepali using Pillow
            text = f"Predicted: {predicted_label[0]}"
            draw.text((50, 50), text, font=font, fill=(0, 255, 0))

            # Convert the Pillow image back to an OpenCV image
            image = np.array(pil_image)

            # Draw the landmarks
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    # Display the result
    cv2.imshow('Hand Gesture Recognition', image)

    # Exit if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
