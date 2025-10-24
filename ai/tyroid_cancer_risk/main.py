import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib

dataset_path = "dataset.csv"

df = pd.read_csv(dataset_path)

df = df.drop("Patient_ID", axis = 1)
df = df.drop("Country", axis = 1)
df = df.drop("Ethnicity", axis = 1)
df = df.drop("Radiation_Exposure", axis = 1)
df = df.drop("Diagnosis", axis = 1)
df = df.drop("Nodule_Size", axis = 1)

df['Family_History'] = df['Family_History'].map({'No' : 0,'Yes' : 1})
df['Iodine_Deficiency'] = df['Iodine_Deficiency'].map({'No' : 0,'Yes' : 1})
df['Smoking'] = df['Smoking'].map({'No' : 0,'Yes' : 1})
df['Obesity'] = df['Obesity'].map({'No' : 0,'Yes' : 1})
df['Diabetes'] = df['Diabetes'].map({'No' : 0, 'Yes' : 1})
df['Gender'] = df['Gender'].map({'Female': 0, 'Male': 1})
print(df.isna().any().any())
X = df.drop("Thyroid_Cancer_Risk", axis=1)
y = df["Thyroid_Cancer_Risk"]

data_cleaned = pd.concat([X, y], axis=1).dropna()

X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.8, random_state=42)

y_train = y_train.map({'Low': 0, 'Medium': 1, 'High': 2})
y_test = y_test.map({'Low': 0, 'Medium': 1, 'High': 2})

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


#TODO See if you can get better accruacy

model = LogisticRegression(
    multi_class='multinomial',
    solver='lbfgs',
    max_iter=400
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Acc:", accuracy)

joblib.dump(model, "tyoid_cancer_risk.joblib")

