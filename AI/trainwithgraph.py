import cv2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

# Load the dataset
df = pd.read_csv('./hand_data.csv')

# Separate features and labels
X = df.drop('label', axis=1)  # All columns except 'label' (features)
y = df['label']  # The 'label' column (alphabet labels)

# Encode the labels as numbers
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Initialize variables for plotting
train_sizes = np.linspace(0.1, 0.99, 10)  # 10 points from 10% to 99%
train_accuracies = []
test_accuracies = []

# Train and evaluate the model for different training set sizes
for train_size in train_sizes:
    # Convert train_size to a native Python float
    train_size = float(train_size)  
    X_partial_train, _, y_partial_train, _ = train_test_split(X_train, y_train, train_size=train_size, random_state=42)
    
    # Train the SVM model
    svm_model = SVC(kernel='linear')
    svm_model.fit(X_partial_train, y_partial_train)
    
    # Evaluate on training and testing data
    train_accuracies.append(svm_model.score(X_partial_train, y_partial_train))
    test_accuracies.append(svm_model.score(X_test, y_test))

# Plot the learning curve
plt.figure(figsize=(10, 6))
plt.plot(train_sizes * 100, train_accuracies, label='Training Accuracy', marker='o')
plt.plot(train_sizes * 100, test_accuracies, label='Testing Accuracy', marker='s')
plt.title('SVM Accuracy vs Training Set Size')
plt.xlabel('Training Set Size (%)')
plt.ylabel('Accuracy')
plt.legend()
plt.grid()
plt.show()
