import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

dataset_path = "dataset.csv"

df = pd.read_csv(dataset_path)
df['Risk Level'] = df['Risk Level'].map({'Low' : 0,'High' : 1})

df = df.dropna(subset=['Risk Level'])

X = df.drop("Risk Level", axis=1)
y = df["Risk Level"]

data_cleaned = pd.concat([X, y], axis=1).dropna()

X = data_cleaned.drop("Risk Level", axis=1)
y = data_cleaned["Risk Level"]

X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.8, random_state=42)

model = LogisticRegression()

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Acc:", accuracy)