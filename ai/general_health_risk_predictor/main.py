import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib

dataset_path = "dataset.csv"

df = pd.read_csv(dataset_path)
df['gender'] = df['gender'].map({'Female': 0, 'Male': 1})

X = df.drop("disease_risk", axis=1)
y = df["disease_risk"]

X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.8, random_state=42)

model = LogisticRegression()

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Acc:", accuracy)

joblib.dump(model, "general_health_predictor.joblib")
