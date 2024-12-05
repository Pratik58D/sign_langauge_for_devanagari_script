import cv2
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

#this loads the dataset
df = pd.read_csv('./hand_data.csv')

#it helps Separate features and labels
# The 'label' column (alphabet labels)
X = df.drop('label', axis=1)
# y is the label data from csv
y = df['label']  

#it helps to Encode the labels as numbers
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Spliting the data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train the SVM model by using  linear kernel for SVM
svm_model = SVC(kernel='linear')  
svm_model.fit(X_train, y_train)

#it gives the model on the test set
y_pred = svm_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model accuracy on test data: {accuracy * 100:.2f}%")

# Save the trained model
import joblib
joblib.dump(svm_model, 'svm_model.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
print("Model and label encoder saved.")
